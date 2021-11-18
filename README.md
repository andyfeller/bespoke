# bespoke

[![Use this template](https://github.com/stack-instance/badge.svg)](https://github.com/stack-instance?stack_template_owner=andyfeller&stack_template_repo=bespoke)

## Why should you use this stack?
You need an easy way to create GitHub repositories with tailor made projects and issues.

Leveraging [handlebars templating](https://handlebarsjs.com/) with [`populate_project` action](.github/actions/populate_project), this stack enables you to tailor newly created repositories for various uses cases.

## What are the inputs to pass while setting up the stack?

<dl>
    <dt><code>init_engagements</code></dt>
    <dd>
        Whether to initialize customer engagements.
    </dd>
    <dd>
        Default: <code>"yes"</code>
    </dd>
    <dt><code>customer_name</code></dt>
    <dd>
        Name of customer this repository is for if <code>init_engagements</code>.
    </dd>
    <dt><code>debug</code></dt>
    <dd>
        Whether to display debug information during init.
    </dd>
    <dd>
        Default: <code>"no"</code>
    </dd>
</dl>

#### Github apps installed with this stack
None

## Learn more

### Handlerbars
Learn more about [handlebars.js](https://handlebarsjs.com/guide/) from the official guide.

### GitHub APIs
Learn more about GitHub [REST](https://docs.github.com/en/rest/reference) and [GraphQL](https://docs.github.com/en/graphql/reference) APIs from the reference docs.

## Contributors
- Andy Feller ([@andyfeller](https://github.com/andyfeller))

## License
Unless otherwise noted, this GitHub Stack is distributed under the MIT license found in the [LICENSE](./LICENSE) file.
