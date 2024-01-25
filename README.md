# Twin + Next.js (App dir) + Emotion + TypeScript

Problem solved with https://github.com/ben-rogerson/twin.macro/issues/788#issuecomment-1909385071

1. install `babel-plugin-twin`

2. next.config.mjs
```
import withTwin from './withTwin.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = withTwin({
  reactStrictMode: true,
});

export default nextConfig;
```

3. withTwin.mjs
```
import babelPluginTwin from 'babel-plugin-twin';
import babelPluginMacros from 'babel-plugin-macros';
import babelPluginTypescript from '@babel/plugin-syntax-typescript';

import * as path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// The folders containing files importing twin.macro
const includedDirs = [path.resolve(__dirname, 'src')];

/** @returns {import('next').NextConfig} */
export default function withTwin(
  /** @type {import('next').NextConfig} */
  nextConfig,
) {
  return {
    ...nextConfig,
    compiler: {
      ...nextConfig.compiler,
      // styledComponents: true,
    },
    webpack(config, options) {
      const {dev} = options;
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];

      config.module.rules.push({
        test: /\.(tsx|ts)$/,
        include: includedDirs,
        use: [
          {
            loader: 'babel-loader',
            options: {
              sourceMaps: dev,
              plugins: [
                babelPluginTwin,
                babelPluginMacros,
                // no more need for babel-plugin-styled-components
                // see: https://nextjs.org/docs/architecture/nextjs-compiler#styled-components
                [babelPluginTypescript, {isTSX: true}],
              ],
            },
          },
        ],
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }
      return config;
    },
  };
}

```

---
I encountered an error("ReactServerComponentsError") when using useState as follows:

1. I download next-emotion-typescript project by command below on 01.23.2024 (with example project updated three days ago)
```shell
npx degit https://github.com/ben-rogerson/twin.examples/next-emotion-typescript folder-name
```

2. From within the new folder, run `npm install`, then `npm run dev` to start the dev server.

3. add `TestComponent` in `/src/app/components/TestComponents.tsx`
  - this compoenent is a simple counter component
  - I write `use client` because I use `useState` & `twin.macro`
  ```
    /** @jsxImportSource @emotion/react */
    'use client'
    import 'twin.macro'
    
    import { useState } from 'react'
    import { Button } from '@/components'
    
    export default function TestComponent() {
      const [count, setCount] = useState(0)
      return (
        <div tw="flex justify-center items-center h-screen flex-col">
          <p tw="mb-8">count: {count}</p>
          <div tw="w-60 flex justify-between">
            <Button variant="primary" onClick={() => setCount(count + 1)}>
              plus
            </Button>
            <Button variant="primary" onClick={() => setCount(count - 1)}>
              minus
            </Button>
          </div>
        </div>
      )
    }
  ```

4. import "TestComponent" in Test page("/src/app/test/page.tsx")
  - I think I don't need to  specify "use client" at the top of a file to make it a client side component,
  - because Test page file don't have any React hooks or twin.macro code

5. But I encountered an error("ReactServerComponentsError")

```
Error: 
  × You're importing a component that needs useState. It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.
  │ Learn more: https://nextjs.org/docs/getting-started/react-essentials
  │ 
  │ 
   ╭─[/Users/jay/lfin/test/next14-twin-react-hook-error/src/components/TestComponents.tsx:2:1]
 2 │ function _EMOTION_STRINGIFIED_CSS_ERROR__() {
 3 │     return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
 4 │ }
 5 │ import { useState } from "react";
   ·          ────────
 6 │ import { Button } from "@/components";
 7 │ var _ref = "development" === "production" ? {
 8 │     name: "15ls8gv",
   ╰────

Import trace for requested module:
./src/components/TestComponents.tsx
./src/app/test/page.tsx
```

I did not encounter this error before setting twin.macro, but I encountered this error after setting twin.macro and am curious as to why🥹
