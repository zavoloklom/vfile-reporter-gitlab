# VFile Reporter in Gitlab Codequality Format

[![Latest Release](https://img.shields.io/npm/v/%40gitlab-formatters%2Fvfile-reporter-gitlab?style=flat-square)](https://www.npmjs.com/package/@gitlab-formatters/vfile-reporter-gitlab)
![Coverage Badge](https://img.shields.io/codacy/coverage/adfdd9f8f6e640dc967d5e6bc47f6fd3?style=flat-square&label=Coverage)
[![Codacy Code Quality Badge](https://img.shields.io/codacy/grade/adfdd9f8f6e640dc967d5e6bc47f6fd3?style=flat-square&logo=codacy&label=Code%20Quality)](https://app.codacy.com/gl/gitlab-formatters/vfile-reporter-gitlab/dashboard?utm_source=gl&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=whit&style=flat-square)](https://conventionalcommits.org)

Formatter that transforms [VFile](https://github.com/vfile/vfile) error reports into a format suitable for use
with [GitLab widgets](https://docs.gitlab.com/ee/ci/testing/code_quality.html).

And it could be used with linting tools like [Remark Lint](https://github.com/remarkjs/remark-lint).

> The source code is hosted on [GitLab](https://gitlab.com/gitlab-formatters/vfile-reporter-gitlab).
> Although there is an automatic mirror of this repository
> on [GitHub](https://github.com/zavoloklom/vfile-reporter-gitlab), all bug reports, feature requests, and merge
> requests should be submitted through GitLab.

## Usage

Install `vfile` and `@gitlab-formatters/vfile-reporter-gitlab` using your package manager:

```bash
npm install --save-dev vfile @gitlab-formatters/vfile-reporter-gitlab
```

```bash
yarn add --dev vfile @gitlab-formatters/vfile-reporter-gitlab
```

And you can run it in your code using either ESM or CommonJS syntax.

```js
import {VFile} from 'vfile';
import gitlabCodeQualityFormatter from '@gitlab-formatters/vfile-reporter-gitlab';

const one = new VFile({path: 'test/fixture/1.js'});
const two = new VFile({path: 'test/fixture/2.js'});

one.message('Warning!', {line: 2, column: 4});

console.log(gitlabCodeQualityFormatter([one, two]));
```

Console output would be:

```json
[{"type":"issue","check_name":"Unknown Rule","description":"Warning!","content":{"body":"Error found in Unknown Rule."},"categories":["Style"],"location":{"path":"test/fixture/1.js","lines":{"begin":2,"end":2},"positions":{"begin":{"line":2,"column":4},"end":{"line":2,"column":4}}},"severity":"minor","fingerprint":"079dd4da95f949d9a91749b0130098f1"}]
```

## Usage with Remark Lint

Install `remark-cli` and `@gitlab-formatters/vfile-reporter-gitlab` using your package manager:

```bash
npm install --save-dev remark-cli @gitlab-formatters/vfile-reporter-gitlab
```

```bash
yarn add --dev remark-cli @gitlab-formatters/vfile-reporter-gitlab
```

To use in your project, simply run:

```bash
npx remark . --report @gitlab-formatters/vfile-reporter-gitlab
```

For integration with GitLab CI, add the following to your `.gitlab-ci.yml`:

```yml
remark:
  image: node:20.14.0-alpine3.20
  stage: codequality
  script:
    - npm ci
    - npx remark . --report @gitlab-formatters/vfile-reporter-gitlab 2>gl-codequality.json
  artifacts:
    reports:
      codequality: gl-codequality.json
```

## Output Example

Below is a JSON example of how the formatter reports issues.

This particular example outputs a detailed report that goes beyond the minimal fields required by GitLab's code quality
widgets.

While GitLab requires only a subset of fields according to
the [Gitlab Code Quality specification](https://docs.gitlab.com/ee/ci/testing/code_quality.html#implement-a-custom-tool),
this formatter implements the full set of fields as outlined in
the [Code Climate Issue Data Type specification](https://github.com/codeclimate/platform/blob/master/spec/analyzers/SPEC.md#issues).

This comprehensive implementation enhances the depth of information available and facilitates better issue tracking and
resolution.

```json
[
  {
    "type": "issue",
    "check_name": "no-undefined-references",
    "description": "Unexpected reference to undefined definition, expected corresponding definition (``) for a link or escaped opening bracket (`\\[`) for regular text",
    "content": {
      "body": "Error found in no-undefined-references. See https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-undefined-references#readme for more details."
    },
    "categories": [
      "Style"
    ],
    "location": {
      "path": "README.md",
      "lines": {
        "begin": 16,
        "end": 16
      },
      "positions": {
        "begin": {
          "line": 16,
          "column": 3
        },
        "end": {
          "line": 16,
          "column": 6
        }
      }
    },
    "severity": "minor",
    "fingerprint": "e2a76405959e5bc34b5a22fda2832b16"
  }
]
```

You can see an example of the widget and how errors are displayed
in [Merge Request #1](https://gitlab.com/gitlab-formatters/vfile-reporter-gitlab/-/merge_requests/1).

This merge request includes detailed examples and explanations of the widget's functionality, showcasing how it
integrates with GitLab to display code quality issues reported by Remark.

## Contributing

If you'd like to contribute to this project, please read through [CONTRIBUTING.md](./CONTRIBUTING.md) file.

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating
in this project you agree to abide by its causes.

## Changelog

> Changelog is automatically generated based on [semantic-release](https://github.com/semantic-release/changelog)
> and [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

See the [CHANGELOG.md](./CHANGELOG.md) file for detailed lists of changes for each version.

## License

MIT License. See the [License File](./LICENSE) for more information.

## Contacts

If you have any questions or suggestions, feel free to reach me out by:

- Email: [s.kupletsky@gmail.com](mailto:s.kupletsky@gmail.com)
- X/Twitter: <https://x.com/zavoloklom>
- GitHub: <https://github.com/zavoloklom>
