"use strict";

const alfy = require("alfy");
const JiraClient = require("jira-connector");

const jira = new JiraClient({
  host: process.env.jiraHost,
  basic_auth: {
    base64: process.env.jiraAuthentication
  }
});

const showProjects = projects => {
  if (!projects) {
    alfy.error("No JIRA projects found.");
    return;
  }

  const matchingProjects = alfy.matches(alfy.input, projects, "name");

  alfy.output(
    matchingProjects.map(({ name, key, projectTypeKey, avatarUrls }) => ({
      title: name,
      subtitle: `${key} - ${projectTypeKey.toUpperCase()}`,
      icon: {
        path: avatarUrls["48x48"]
      }
    }))
  );
};

const cachedProjects = alfy.cache.get("allProjects");

if (cachedProjects) {
  showProjects(cachedProjects);
} else {
  jira.project.getAllProjects(null, (err, projects) => {
    alfy.cache.set("allProjects", projects);

    showProjects(projects);
  });
}
