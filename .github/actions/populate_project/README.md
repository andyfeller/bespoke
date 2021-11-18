# populate_project

`populate_project` creates GitHub projects, issues, and cards through [handlebar.js] templating and straight forward YAML configuration.

## Usage

**Minimal**

```yaml
name: Stack Initialize
on:
  workflow_dispatch:
jobs:
  populate_project:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ./.github/actions/populate_project
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

The above is the minimal needed to use this action within a workflow to create GitHub projects, columns, and issues captured within [configuration file](#configuration).

### Inputs & Outputs

This action has minimal inputs and outputs with customization primarily captured in [configuration file](#configuration).

For the definitive list, see [action.yml](./action.yml):

**Inputs**

<dl>
    <dt><code>config-dir</code></dt>
    <dd>
        Path to directory containing <code>config.yml</code> file.
    </dd>
    <dd>
        Default: <code>".github/populate_project"</code>
    </dd>
    <dt><code>debug</code></dt>
    <dd>
        Boolean whether to log debug information.
    </dd>
    <dd>
        Default: <code>"false"</code>
    </dd>
    <dt><code>fail-fast</code></dt>
    <dd>
        Boolean whether to fail if any project fails to be created.
    </dd>
    <dd>
        Default: <code>"false"</code>
    </dd>
    <dt><code>github-token</code></dt>
    <dd>
        GitHub personal access token used for API interactions.
    </dd>
    <dd>
        Required
    </dd>
</dl>

**Outputs**

None

### Configuration

Contained in the `config-dir` directory, the `config.yml` YAML file describes the projects and issues to populate within a GitHub repository:

```yaml
projects:
  - name: Example Engagement
    body: |
      This is a project board that might be created for a customer engagement.

    columns:
      - Backlog
      - To Do
      - In Progress
      - Done

    issues:
      - title: Backlog item
        body: |
          Stubbed text for generic backlog issue.

      - title: {{ github.payload.inputs.customer_name }} introduction
        column: To Do
        body: |
          This should be an introduction with {{ github.payload.inputs.customer_name }}.

  - name: Another Example
    body: |
      Stub description of project.

    columns:
      - A
      - B
      - C
```

As seen above:

- `projects` can create 1 or more projects
- `columns` will appear from left to right
- `issues` is optional and can create 1 or more issues and project cards
- `issues` can use [handlebars.js] templating along with the [github context](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context) and `project` resource 
- `issues` without a `column` attribute will be assigned to the first item in the project's `columns` list

[handlebars.js]: https://handlebarsjs.com