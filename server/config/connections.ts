const config = {
  production: {
    jira_api_connection: {
      protocol: "http",
      host: "jira.secondcompany.nl",
      port: "8080"
    },
    jira_db_connection: {
      host: "127.0.0.1",
      user: "jiradbuser",
      password: "Ex0ticBuGS8",
      database: "jiradb",
      port: "5432",
      max: 100,
      idleTimeoutMillis: 30000
    },
    sc_platform_db_connection: {
      host: "127.0.0.1",
      database: "sc-platform",
      port: "27017"
    },
    sc_platform_backend_port: 3001,
    customerJiraUsername: "support",
    customerJiraPassword: "VzBp8ckSK8x9ShGN",
    domain: "https://platform.secondcompany.nl"
  },
  test: {
    jira_api_connection: {
      protocol: "http",
      host: "jira.secondcompany.nl",
      port: "8080"
    },
    jira_db_connection: {
      host: "127.0.0.1",
      user: "jiradbuser",
      password: "Ex0ticBuGS8",
      database: "jiradb",
      port: "5432",
      max: 100,
      idleTimeoutMillis: 30000
    },
    sc_platform_db_connection: {
      host: "127.0.0.1",
      database: "test_sc-platform",
      port: "27017"
    },
    sc_platform_backend_port: 3002,
    customerJiraUsername: "support",
    customerJiraPassword: "VzBp8ckSK8x9ShGN",
    domain: "https://platform-test.secondcompany.nl"
  },
  development: {
    jira_api_connection: {
      protocol: "http",
      host: "jira.secondcompany.nl",
      port: "8080"
    },
    jira_db_connection: {
      host: "127.0.0.1",
      user: "",
      password: "",
      database: "jiradb",
      port: "5432",
      max: 100,
      idleTimeoutMillis: 30000
    },
    sc_platform_db_connection: {
      host: "127.0.0.1",
      database: "dev_sc-platform",
      port: "27017"
    },
    sc_platform_backend_port: 3001,
    customerJiraUsername: "support",
    customerJiraPassword: "VzBp8ckSK8x9ShGN",
    domain: "http://localhost:8080"
  }
};

const connection = config[process.env.NODE_ENV || "development"];

export default connection;
