# olo id

olo id aims provide needed functionality around ids and identifying entities in general: checking if two ids are the same and compiling ids in various formats.

## Installation

Navigate to your project folder and enter the following in you terminal:

```sh
npm i olo-id --save
```

## Usage

You can use the olo id class for ids stored in one parameter of your entity or in multiple identifiaction props. You just need to let the class know the relevant property names.

```ts
const user1 = new OloId(
  {
    username: 'albert.einstein',
    domain: 'oloteo.com',
    name: 'Albert Einstein',
    role: 'admin',
  },
  {
    syntax: ['username', 'domain'], // defines the email property as unique identifier
    register: true, // registers the syntax defined for the id app wide, so you don't need to set it again when creating another user.
    separator: '@', // defines the seperator character that is used when the id is rendered into a string, defaults to '/'.
  },
);

const user2 = new OloId({
  email: 'robert.oppermann',
  domain: 'oloteo.com',
  name: 'Robert Oppenheimer',
  role: 'editor',
});

const user3 = new OloId('albert.einstein@oloteo.com', { syntax: ['username', 'domain'], separator: '@' });

console.log(user1.isSame(user2)); // false
console.log(user1.isSame(user3)); // true
console.log(user1.toString()); // albert.einstein@oloteo.com
console.log(user2.toJSON()); // { username: 'robert.oppermann', domain: '@oloteo.com' }
```

## OLoIdSet

If there are more then one property or prop-combos that would identify an entity on their one, you can use an id set. To make this work id syntaxes can't be implicitly defined, but need to be configured explicitly.

```ts
new OloIdSyntax().registerSyntaxes([['id'], ['username', 'domain']]);
```

After that sets are used much in the same way as OloIds.

```ts
const user1 = new OloIdSet({
  id: 'ae123',
  username: 'albert.einstein',
  domain: 'oloteo.com',
  name: 'Albert Einstein',
  role: 'admin',
});

const user2 = new OloIdSet('ae123', { syntax: ['id'] });

const user3 = new OloIdSet({
  username: 'albert.einstein',
  domain: 'oloteo.com',
});

console.log(user1.isSame(user2)); // true
console.log(user1.isSame(user3)); // true
console.log(user1.toString()); // ae123 albert.einstein@oloteo.com
console.log(user1.toJSON()); // { id: 'ae123', username: 'albert.einstein', domain: '@oloteo.com' }
```

# Extending olo id classes

Extending one of the olo id classes might be the most convenient way of accessing its functionality, as all structures need to be only setup once.

```ts
new OloIdSyntax().registerSyntaxes([['id'], ['username', 'domain']]);

class User extends OloIdSet<[['id'], ['username', 'domain']], string, '@'> {
  public name: string;
  public role: string;

  constructor({
    id,
    username,
    domain,
    name,
    role,
  }: {
    id: string;
    username: string;
    domain: string;
    name: string;
    role: string;
  }) {
    super({ id, username, domain }, { separator: '@' });
    this.name = name;
    this.role = role;
  }
}

const user1 = new User({
  id: 'ae123',
  username: 'albert.einstein',
  domain: 'oloteo.com',
  name: 'Albert Einstein',
  role: 'admin',
});

console.log(
  user1.isSame({
    username: 'albert.einstein',
    domain: 'oloteo.com',
  }),
); // true
```

This package provides two extensions for common use cases:

- `OloReference` for entities that describes links to some other entities.
- `OloRessource` for entities describing assets (e.g. images or videos), that should be referenced or embedded.
