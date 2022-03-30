<p align="center">
  <img src="https://avatars.githubusercontent.com/u/6191378?s=200&v=4" alt="Logo" width="100" />
</p>

# Purge [jsDelivr][jsdelivr] cache

![Release version][badge_release_version]
[![Build Status][badge_build]][link_build]
[![License][badge_license]][link_license]

This GitHub action allows purge file cache on [jsDelivr][jsdelivr] CDN side.

## Usage

```yaml
jobs:
  purge-jsdelivr-cache:
    runs-on: ubuntu-20.04
    steps:
      - uses: gacts/purge-jsdelivr-cache@v1
        with:
          url: |
            https://cdn.jsdelivr.net/npm/jquery@3.2.0/dist/jquery.js
            https://cdn.jsdelivr.net/npm/jquery@3.3.0/dist/jquery.min.js
```

### Customizing

#### Inputs

Following inputs can be used as `step.with` keys:

| Name       |        Type        | Default | Required | Description                             |
|------------|:------------------:|:-------:|:--------:|-----------------------------------------|
| `url`      | `string` or `list` |         |   yes    | URLs for the cache purging              |
| `attempts` |      `number`      |    3    |    no    | Retry attempts (on the request failing) |

## Releasing

New versions releasing scenario:

- Make required changes in the [changelog](CHANGELOG.md) file
- Build the action distribution (`make build` or `yarn build`)
- Commit and push changes (including `dist` directory changes - this is important) into the `master` branch
- Publish new release using repo releases page (git tag should follow `vX.Y.Z` format)

Major and minor git tags (`v1` and `v1.2` if you publish `v1.2.Z` release) will be updated automatically.

## Support

[![Issues][badge_issues]][link_issues]
[![Issues][badge_pulls]][link_pulls]

If you find any action errors, please, [make an issue][link_create_issue] in the current repository.

## License

This is open-sourced software licensed under the [MIT License][link_license].

[badge_build]:https://img.shields.io/github/workflow/status/gacts/purge-jsdelivr-cache/tests?maxAge=30
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
