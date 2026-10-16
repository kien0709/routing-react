# capacitor-device-shake

Shake detection with vibration feedback

## Install

To use npm

```bash
npm install capacitor-device-shake
````

To use yarn

```bash
yarn add capacitor-device-shake
```

Sync native files

```bash
npx cap sync
```

## API

<docgen-index>

* [`enableListening()`](#enablelistening)
* [`stopListening()`](#stoplistening)
* [`addListener('shake', ...)`](#addlistenershake-)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### enableListening()

```typescript
enableListening() => Promise<void>
```

Start met luisteren naar schudden.

--------------------


### stopListening()

```typescript
stopListening() => Promise<void>
```

Stop met luisteren naar schudden.

--------------------


### addListener('shake', ...)

```typescript
addListener(eventName: 'shake', listenerFunc: () => void) => Promise<PluginListenerHandle>
```

Callback bij een schud, alleen als enableListening aan staat.

| Param              | Type                       |
| ------------------ | -------------------------- |
| **`eventName`**    | <code>'shake'</code>       |
| **`listenerFunc`** | <code>() =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Alle listeners weghalen.

--------------------


### Interfaces


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |

</docgen-api>
