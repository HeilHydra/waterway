

## Features

* Server
* Client
* 

https://github.com/rjrodger/patrun/blob/master/test/patrun.spec.js#L324

## Methods

### Client

#### Waterway.client(conf);

#### WaterwayClient.stream();

Streams are multi-payload messaging channels, designed for large or continuous data.

* WaterwayStream.readable();
* WaterwayStream.writeable();

#### WaterwayClient.event();

Events are single, terminal pieces of data that do not receive a response.

* WaterwayEvent.receive();
* WaterwayEvent.send();

#### WaterwayClient.request();

Requests are events that receive a response.

* WaterwayRequest().receive();
* WaterwayRequest().send();



subscribe stream:*
publish stream:*

subscribe event:*
publish event:*

publish request:*
subscribe request:*
publish respond:*
subscribe respond:*