<p align="center">
  <img src="https://avatars.githubusercontent.com/u/6191378?s=200&v=4" alt="Logo" width="100" />
</p>

# Purge [jsDelivr][jsdelivr] cache

![Release version][badge_release_version]
[![Build Status][badge_build]][link_build]
[![License][badge_license]][link_license]

This GitHub action allows purge file cache on [jsDelivr][jsdelivr] CDN side.

> [!NOTE]
> To avoid throttling errors, please use this action with caution and only when necessary.

## Usage

```yaml
jobs:
  purge-jsdelivr-cache:
    runs-on: ubuntu-latest
    steps:
      - uses: gacts/purge-jsdelivr-cache@v1
        with:
          url: |
            https://cdn.jsdelivr.net/npm/jquery@3.2.0/dist/jquery.js
            https://cdn.jsdelivr.net/npm/jquery@3.3.0/dist/jquery.min.js
```

## Customizing

### Inputs

The following inputs can be used as `step.with` keys:

| Name       |        Type        | Default | Required | Description                             |
|------------|:------------------:|:-------:|:--------:|-----------------------------------------|
| `url`      | `string` or `list` |         |   yes    | URLs for the cache purging              |
| `attempts` |      `number`      |    3    |    no    | Retry attempts (on the request failing) |

## Releasing

To release a new version:

- Build the action distribution (`make build` or `npm run build`).
- Commit and push changes (including `dist` directory changes - this is important) to the `master|main` branch.
- Publish the new release using the repo releases page (the git tag should follow the `vX.Y.Z` format).

Major and minor git tags (`v1` and `v1.2` if you publish a `v1.2.Z` release) will be updated automatically.

> [!TIP]
> Use [Dependabot](https://bit.ly/45zwLL1) to keep this action updated in your repository.

## Support

[![Issues][badge_issues]][link_issues]
[![Pull Requests][badge_pulls]][link_pulls]

If you find any errors in the action, please [create an issue][link_create_issue] in this repository.

## License

This is open-source software licensed under the [MIT License][link_license].

[badge_build]:https://img.shields.io/github/actions/workflow/status/gacts/purge-jsdelivr-cache/tests.yml?branch=master&maxAge=30
[badge_release_version]:https://img.shields.io/github/release/gacts/purge-jsdelivr-cache.svg?maxAge=30
[badge_license]:https://img.shields.io/github/license/gacts/purge-jsdelivr-cache.svg?longCache=true
[badge_release_date]:https://img.shields.io/github/release-date/gacts/purge-jsdelivr-cache.svg?maxAge=180
[badge_commits_since_release]:https://img.shields.io/github/commits-since/gacts/purge-jsdelivr-cache/latest.svg?maxAge=45
[badge_issues]:https://img.shields.io/github/issues/gacts/purge-jsdelivr-cache.svg?maxAge=45
[badge_pulls]:https://img.shields.io/github/issues-pr/gacts/purge-jsdelivr-cache.svg?maxAge=45

[link_build]:https://github.com/gacts/purge-jsdelivr-cache/actions
[link_license]:https://github.com/gacts/purge-jsdelivr-cache/blob/master/LICENSE
[link_issues]:https://github.com/gacts/purge-jsdelivr-cache/issues
[link_create_issue]:https://github.com/gacts/purge-jsdelivr-cache/issues/new
[link_pulls]:https://github.com/gacts/purge-jsdelivr-cache/pulls

[jsdelivr]:https://www.jsdelivr.com/
