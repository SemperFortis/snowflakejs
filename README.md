# snowflakejs

SnowflakeJS is a Twitter snowflake generator and deconstructor for JavaScript.

![npm](https://img.shields.io/npm/v/@semperfortis/snowflakejs?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@semperfortis/snowflakejs?style=for-the-badge) ![CircleCI](https://img.shields.io/circleci/build/github/SemperFortis/snowflakejs?style=for-the-badge&token=0529fcb998f249c725bc399db60846d10ccf5551) ![Maintenance](https://img.shields.io/maintenance/yes/2021?style=for-the-badge)

## Installation

```bash
$ yarn add @semperfortis/snowflakejs
```

## Usage

### Generate a snowflake

```js
import { generate } from '@semperfortis/snowflakejs';

// optional epoch, defaults to current date
const snowflake = generate({ epoch: 1577833200000 });

console.log(snowflake);
```

### Return snowflake creation date

```js
import { deconstruct } from '@semperfortis/snowflakejs';

// optional epoch, defaults to current date
const date = deconstruct(snowflake, { epoch: 1577833200000 });

console.log(date);
```
