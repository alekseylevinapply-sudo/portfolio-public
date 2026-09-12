#!/usr/bin/env bash
set -euo pipefail

: "${CODEBERG_PAGES_DEPLOY_KEY:?Missing repository deploy key}"
: "${RUNNER_TEMP:?Missing runner temporary directory}"
: "${GITHUB_WORKSPACE:?Missing workspace}"
: "${GITHUB_SHA:?Missing source commit}"
: "${GITHUB_OUTPUT:?Missing workflow output file}"

# Re-running an old workflow must not replace the site with an older version.
current_main=$(git ls-remote https://github.com/alekseylevinapply-sudo/portfolio-public.git refs/heads/main | awk '{print $1}')
if [[ "$GITHUB_SHA" != "$current_main" ]]; then
  echo 'Source commit is no longer current main; skipping this outdated run.'
  echo 'verify=false' >> "$GITHUB_OUTPUT"
  exit 0
fi
echo 'verify=true' >> "$GITHUB_OUTPUT"

deployment=$(mktemp -d "$RUNNER_TEMP/codeberg-pages.XXXXXX")
trap 'rm -rf -- "$deployment"' EXIT
umask 077
printf '%s\n' "$CODEBERG_PAGES_DEPLOY_KEY" > "$deployment/key"
unset CODEBERG_PAGES_DEPLOY_KEY

# Trust the published Codeberg ED25519 fingerprint, never an unchecked scan.
# https://docs.codeberg.org/security/ssh-fingerprint/
ssh-keyscan -T 20 -t ed25519 codeberg.org > "$deployment/known_hosts"
fingerprint=$(ssh-keygen -lf "$deployment/known_hosts" -E sha256 | awk '{print $2}')
if [[ "$fingerprint" != 'SHA256:mIlxA9k46MmM6qdJOdMnAQpzGxF4WIVVL+fj+wZbw0g' ]]; then
  echo 'Codeberg SSH host fingerprint does not match.' >&2
  exit 1
fi
export GIT_SSH_COMMAND="ssh -i '$deployment/key' -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile='$deployment/known_hosts' -o HostKeyAlgorithms=ssh-ed25519"

checkout="$deployment/pages"
git clone --depth 1 --single-branch --branch pages git@codeberg.org:alekseylevin/pages.git "$checkout"
expected_pages=$(git -C "$checkout" rev-parse refs/remotes/origin/pages)
manifest=$(node "$GITHUB_WORKSPACE/scripts/public-files.mjs")
mapfile -t files <<< "$manifest"
while IFS= read -r -d '' tracked; do
  allowed=false
  for file in "${files[@]}"; do
    if [[ "$tracked" == "$file" ]]; then allowed=true; break; fi
  done
  if [[ "$allowed" != true ]]; then
    echo 'Unexpected tracked file in the Pages repository; publication stopped.' >&2
    exit 1
  fi
done < <(git -C "$checkout" ls-files -z)

for file in "${files[@]}"; do
  if [[ -L "$checkout/$file" || -L "$GITHUB_WORKSPACE/dist/$file" ]]; then
    echo 'Symbolic links are not allowed in published files.' >&2
    exit 1
  fi
  cp -- "$GITHUB_WORKSPACE/dist/$file" "$checkout/$file"
done
git -C "$checkout" add -- "${files[@]}"
# Owner-approved policy: Pages exposes only the current snapshot as one root commit.
# Inspect raw parent headers: a depth-one clone hides parents from revision walks.
tree=$(git -C "$checkout" write-tree)
published_tree=$(git -C "$checkout" rev-parse "$expected_pages^{tree}")
parents=$(git -C "$checkout" cat-file -p "$expected_pages" | sed -n '/^$/q; /^parent /p')
message=$(git -C "$checkout" log -1 --format=%B "$expected_pages")
if [[ "$tree" == "$published_tree" && -z "$parents" && "$message" == 'init' ]]; then
  echo 'Codeberg already contains this website as one init commit; nothing to change.'
  exit 0
fi

git -C "$checkout" config user.name 'github-actions[bot]'
git -C "$checkout" config user.email '41898282+github-actions[bot]@users.noreply.github.com'
# The same source revision produces the same root commit on a retry.
source_date=$(git -C "$GITHUB_WORKSPACE" show -s --format=%cI "$GITHUB_SHA")
new_commit=$(GIT_AUTHOR_DATE="$source_date" GIT_COMMITTER_DATE="$source_date" \
  git -C "$checkout" commit-tree "$tree" -m init)

# Recheck after preparing the snapshot, immediately before changing the remote.
current_main=$(git ls-remote https://github.com/alekseylevinapply-sudo/portfolio-public.git refs/heads/main | awk '{print $1}')
if [[ "$GITHUB_SHA" != "$current_main" ]]; then
  echo 'Source commit changed while preparing publication; skipping this outdated run.'
  echo 'verify=false' >> "$GITHUB_OUTPUT"
  exit 0
fi
# Never retry a rejected lease automatically: a newer publication needs inspection.
git -C "$checkout" push --force-with-lease="refs/heads/pages:$expected_pages" \
  origin "$new_commit:refs/heads/pages"
