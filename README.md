# Waterway [![Build Status](https://travis-ci.org/HeilHydra/waterway.svg)](https://travis-ci.org/HeilHydra/waterway)

Waterway is a Node.js microservice communication framework powered by redis pub/sub. It is designed to be as minimalistic as possible, exposing 3 different methods of communication:

* __Events__: An event is a single uni-directional message that is broadcast by the sender and receives no response. It is designed for reporting state and actions in scenarios where you do not want a response.

* __Requests__: A request is a an event with a response. Each request has a unique ID assigned to it and the sender will only receive the first response for each unique request.

* __Streams__: A stream is a continuous flow of events, wrapped up in Node's Stream API. This allows you to stream any size and type of data between services.


## Keys

All messages in Waterway are organised by their key. A key is an ordered sequence of parameters which internally gets converted into a redis pub/sub channel. Keys are used when creating and receiving messages. For example, this is how you would send and receive a simple event:

```js
waterwayReceiver.event("foo", "bar").on(function (data) {
  console.log(data);
});

waterwaySender.event("foo", "bar").emit("baz"); // -> "baz"
```

Since internally keys just converted into a redis channel you can use wildcards for matching:

```js
waterwayReceiver.event("foo", "*").on(function (data) {
  console.log(data);
});

waterwaySender.event("foo", "bar").emit("baz"); // -> "baz"
waterwaySender.event("foo", "baz").emit("bar"); // -> "bar"
```

__Note:__
* Keys may not contain colons since these are the delimiters used internally by Waterway
* When sending any kind of message your keys may not contain wildcards


## API

### Waterway([config])
Returns a new Waterway instance. Redis config options are those supported by the node redis client.

_Example_:
```js
var waterway = new Waterway({
  redis: {
    port: 1234
  }
});
```

#### `waterway.event(...key)`
Returns a new Waterway event.

_Example_:
```js
waterway.event("foo", "bar");
```

#### `waterway.request(...key)`
Returns a new Waterway request.

_Example_:
```js
waterway.request("foo", "bar");
```

#### `waterway.stream(...key)`
Returns a new Waterway stream.

_Example_:
```js
waterway.stream("foo", "bar");
```

### WaterwayEvent

#### `waterwayEvent.emit([data])`
Emits the event, optionally with data provided.

_Example_:
```js
waterwayEvent.emit("foo");
```

#### `waterwayEvent.on(callback)`
Registers a callback for the event. The callback will be invoked with the event data and matching event key. The matching key is provided incase any parameters matched by wildcards are needed in the callback.

_Example_:
```js
waterwayEvent.on(function (data, key) {
  // Do something with the data or key
});
```

#### `waterwayEvent.off([callback])`
Unregisters an event. If callback is provided only that callback will be unregistered.

_Example_:
```js
waterwayEvent.off(callback);
```

### WaterwayRequest

#### `waterwayRequest.send([data])`
Sends the request, optionally with data provided. Returns a promise.

_Example_:
```js
waterwayRequest.send("foo").then(function (response) {
  // Do something with the response
});
```

#### `waterwayRequest.respond(callback)`
Registers a responder for the request. The callback will be invoked with the request data and matching request key. The matching key is provided incase any parameters matched by wildcards are needed in the callback. The callback can return a promise or regular data in order to respond with data to the requester.

_Example_:
```js
waterwayRequest.respond(function (data, key) {
  return db.get(key[0], data.foo);
});
```

### WaterwayStream

A WaterwayStream is an implementation of Node's [stream.Duplex](https://nodejs.org/api/stream.html#stream_class_stream_duplex) class. This means you can use it to transfer any type of continuous or large data between services. Note that only one instance of Waterway should be writing to a specific key otherwise you risk polluting the data.


## Tests
Run `make test`


## Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally
* Consider starting the commit message with an applicable emoji:
    * :lipstick: `:lipstick:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on Mac OS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies

(From [atom](https://atom.io/docs/latest/contributing#git-commit-messages))


## License

* [MIT](https://raw.github.com/heilhydra/waterway/master/LICENSE)