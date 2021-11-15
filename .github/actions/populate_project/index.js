// Define constants used for contracts / IO
const INPUT_CONFIG_DIR = 'config-dir';
const INPUT_DEBUG = 'debug';
const INPUT_FAIL_FAST = 'fail-fast';
const INPUT_GITHUB_TOKEN = 'github-token';

// Imports
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const util = require('util');
const handlerbars = require('handlebars');

async function run() {

    // Verify inputs for action configuration
    const debug = core.getBooleanInput(INPUT_DEBUG);
    const failFast = core.getBooleanInput(INPUT_FAIL_FAST);
    const configDir = core.getInput(INPUT_CONFIG_DIR, { required: true });
    const githubToken = core.getInput(INPUT_GITHUB_TOKEN, { required: true });

    // Capture some information for debugging purposes if necessary
    const context = github.context;

    if (debug) {
        console.debug(`GitHub context: ${util.inspect(context)}`);
    }

    // Verify and process configuration file
    const octokit = github.getOctokit(githubToken);
    const configPath = path.join(configDir, 'config.yml')

    fs.access(configPath, fs.constants.R_OK, async (err) => {

        if (err) {
            throw err;
        }

        // Create supported resources For project(s) configured
        let success = true;
        const config = yaml.load(fs.readFileSync(configPath));
        const projectConfigs = config.projects || [];

        for (const projectConfig of projectConfigs) {

            try {
                // Create project
                const { data: project } = await octokit.rest.projects.createForRepo({
                    ...context.repo,
                    name: projectConfig.name,
                    body: projectConfig.body,
                });

                console.log(`Created project "${project.name}" (${project.id})`);

                // Create project column(s)
                const columnConfigs = projectConfig.columns || [];
                const columnNameLookup = {};
                let defaultColumn = null;

                for (const columnConfig of columnConfigs) {
                    const { data: column } = await octokit.rest.projects.createColumn({
                        project_id: project.id,
                        name: columnConfig
                    })

                    console.log(`Created project column "${column.name}" (${column.id}) for project "${project.name}" (${project.id})`);

                    columnNameLookup[column.name] = column;

                    if (defaultColumn == null) {
                        defaultColumn = column;
                    }
                }

                // Create project issues
                const issueConfigs = projectConfig.issues || [];
                const templateData = {
                    github: context,
                    project: project,
                }

                for (const issueConfig of issueConfigs) {

                    // Create issue based on templated content
                    const issueTitle = handlerbars.compile(issueConfig.title);
                    const issueBody = handlerbars.compile(issueConfig.body);
                    const column = (issueConfig.column) ? columnNameLookup[issueConfig.column] : defaultColumn;

                    const { data: issue } = await octokit.rest.issues.create({
                        ...context.repo,
                        title: issueTitle(templateData),
                        body: issueBody(templateData),
                    })

                    console.log(`Created issue "${issue.title.trim()}" (${issue.id}) for project "${project.name}" (${project.id})`);

                    // Create project card, associates issue to project column
                    const { data: card } = await octokit.rest.projects.createCard({
                        column_id: column.id,
                        content_type: 'Issue',
                        content_id: issue.id,
                    })

                    console.log(`Created project card (${card.id}) to ${card.content_url.trim()} for project "${project.name}" (${project.id})`);
                }
            } catch (err) {
                success = false;

                if (failFast) {
                    throw err;
                } else {
                    console.error(err);
                }
            }
        }

        if (!success) {
            throw new Error(`One or more errors were caught while creating projects without ${INPUT_FAIL_FAST}`);
        }
    })
}

run();