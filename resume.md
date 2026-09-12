# Алексей Лёвин

**Java Backend Engineer**

20+ лет в IT · Java/backend с 2016 года

[GitHub: alekseylevinapply-sudo](https://github.com/alekseylevinapply-sudo)

[Telegram: @aleksey_y_levin](https://t.me/aleksey_y_levin)

## Профиль

Разрабатываю и поддерживаю backend на Java и Spring. Работал с банковскими платежами, страховыми процессами, телематикой и обменом данными между системами. Участвую в проектировании, пишу код и тесты, провожу code review и разбираю production-инциденты. Использую AI-инструменты для кода, тестов и документации, проверяю результаты.

## Технологии

- Backend: Java 8–21, Spring Boot 2/3, Spring Framework, Spring Cloud, Spring MVC, Spring Data, Spring Security, Spring Batch, MapStruct. Maven — основной инструмент сборки, Gradle — дополнительный.
- Базы данных: PostgreSQL, Oracle, jOOQ, Hibernate/JPA, SQL, Liquibase, Flyway. Оптимизация запросов, транзакции и миграции данных.
- Интеграции: Kafka, JMS/Artemis, Apache Camel, REST, SOAP, WSDL/XSD, XML-RPC, OpenAPI/Swagger, Feign.
- Workflow: Camunda 7, Flowable/Activiti, BPMN. Оркестрация процессов, Saga, статусы операций и компенсации.
- Надёжность: Идемпотентность, retry/backoff, DLQ, transactional outbox, circuit breaker, bulkhead, rate limiting и backpressure.
- Тестирование: JUnit 4/5, Mockito, AssertJ, Testcontainers, WireMock, MockMvc, Spring Test, Postman, SoapUI. Модульные и интеграционные тесты.
- Runtime и CI/CD: Docker, Kubernetes, OpenShift, Helm, Jenkins, GitLab CI, Azure DevOps/TFS, Linux, Bash.
- Мониторинг: Prometheus, Grafana, ELK, Loki, структурированные логи, correlationId. Диагностика инцидентов, GC-анализ и tcpdump.
- Архитектура: Модульный монолит, Clean Architecture, элементы DDD, событийное взаимодействие, границы сервисов и контракты интеграций.
- AI в разработке: AI-assisted development: Codex, OpenClaw, OpenRouter/Kimi. Агентные рабочие процессы, версионирование промптов и спецификаций, проверка кода и результатов. Изучаю Spring AI, LangChain и LangGraph.

## Опыт работы

### Проект Ингосстраха

**Старший инженер-программист · 2025 — 2026**

- Доработка backend-сервисов Legal Case Microservices Platform на Java 17 и Spring Boot.
- Участие в запуске в production, миграциях данных и юридических процессов в Camunda 7.
- Разбор инцидентов, развёртывание и мониторинг: Kubernetes, TFS/Azure DevOps.

### Иннотех / ВТБ

**Эксперт Java-разработчик · 2023 — 2024**

- Работа над оркестратором B2B-платежей в составе команды в рамках импортозамещения банковских систем. Пиковая нагрузка всего контура из четырёх сервисов — около 1000 RPS.
- Разработка компонентов модульного монолита с Clean Architecture и элементами DDD. В ходе развития проекта из него выделены отдельные сервисы.
- Участие в BPMN-процессах Camunda 7: Saga/process orchestration, статусы операций, idempotency keys, ретраи с exponential backoff, компенсации и transactional outbox; интеграции с платёжными и банковскими сервисами.
- Декомпозиция задач, code review, участие в технических собеседованиях, обсуждение технических решений и помощь коллегам при подключении к проекту. Java 17–21, Spring Boot, Camunda 7, Kafka/Artemis, PostgreSQL, jOOQ, Liquibase, Kubernetes/OpenShift.

### Сбербанк Лизинг

**Архитектор Java / Solution Architect · 2020 — 2023**

- Спроектировал два Java-сервиса с нуля, один реализовал полностью при переходе от Dynamics NAV.
- Телематический сервис: около 50 параметров со 100 000 устройств, опрос раз в сутки. Batch/ETL на Spring Batch; задачи отчётности, выбора поставщиков и оркестрации заявок.
- Внедрение событийного обмена вместо long polling, transactional outbox и rate limiting. Kafka, MinIO/S3, PostgreSQL.
- Настройка GitLab CI, Helm, Kubernetes и мониторинга вместе с командой. Несколько экземпляров сервисов в кластере из 3 нод; ELK, Prometheus/Grafana и сопровождение в production.

### ЮТэйр

**Старший Java-разработчик · 2018 — 2020**

- Работа в команде интеграционной платформы: около 100 потоков между примерно 20 системами. Разработка Java-сервисов, маршрутов Apache Camel и обработчиков Kafka.
- Преобразование XML/JSON, интеграции по REST/SOAP и тестирование сценариев обмена данными.
- Работа с Kafka topics, consumer groups, порядком сообщений в партиции, lag/offsets, manual commit, DLQ, retry/redelivery и throttling внешних API.
- Разбор production-инцидентов, включая утечки памяти и соединений в омниканальном чате: GC-анализ, tcpdump, ELK/Prometheus.
- Участие в переходе к Docker/Kubernetes, работа с BPMN и Flowable/Activiti, наставничество младших Java-разработчиков.

### Проект Московской биржи

**Java-разработчик · 2016 — 2018**

- Интеграции клиентского кабинета, автоматизация заявок на доступ к торговым системам и изменения клиентской базы данных.
- SOAP, REST и XML-RPC интеграции. Java 8, Spring Framework, Oracle, JPA, JSF/PrimeFaces, Tomcat 7–8, Jenkins, Jira/Confluence.

### ЦУМ, ТД

**Системный администратор Linux · 2014 — 2016**

- Администрирование Linux-инфраструктуры кассовых узлов и серверов торговой сети, сопровождение Linux/PostgreSQL.
- Мониторинг, Bash-автоматизация, диагностика и устранение инцидентов.
- Стек: Linux, PostgreSQL, Bash, SSH, Zabbix.

### LEFUTUR

**Системный администратор · 2012 — 2014**

- Техническая поддержка пользователей офиса и магазинов, сопровождение офисного и кассового оборудования.
- Администрирование Windows-серверов и рабочих станций, решение инцидентов.
- Стек: Windows Server, PowerShell, RDP, SSH, Bash, TeamViewer, 1С.

## Образование и языки

Московский Математический Колледж, 2007. Программирование, программное обеспечение ВТ и АС.

Русский — родной. Английский — B1, чтение документации и переписка.
