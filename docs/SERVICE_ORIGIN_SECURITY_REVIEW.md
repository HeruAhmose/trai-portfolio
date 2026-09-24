# Service request boundary review

Reviewed against `b510185d480a119876b31be5c8aef2eb0474e508`, with the redirect and Maps endpoint repairs in this change.

## Findings and trust boundary

Code scanning alerts 2 and 3 trace `process.env.BUILT_IN_FORGE_API_URL` through the origin validator to the LLM and Maps clients. Alerts 4, 5 and 6 trace `process.env.OAUTH_SERVER_URL` through the same kind of validator to the OAuth code, access-token and JWT requests. All five source paths were inspected in the scanning UI and source code.

These environment values are deployment configuration supplied by the operator. HTTP callers cannot set them. Incoming prompts, addresses, OAuth codes, state and tokens are request payloads or encoded query values; they never select the service origin. The OAuth paths and LLM completion path are constants. HTTPS, origin-only syntax and absence of embedded credentials remain required. Arbitrary operator-selected HTTPS services remain supported; naming a function “trusted” is not itself a security control.

The flagged environment-to-origin flows are false positives for remote SSRF under this boundary. They must be reopened if deployment configuration becomes user-controlled, a remote configuration endpoint is introduced, or request data is used to select an origin. The static GitHub Pages deployment does not run these server modules, but that is not a reason to leave the retained integrations unsafe.

## Concrete repairs

- Credentialed Fetch requests reject redirects. The OAuth Axios client follows zero redirects. A service response can no longer forward a code, token, payload or Maps query to a different destination.
- Maps operations must use the documented `/maps/api/` or `/v1/` path forms. Traversal, encoded path segments, embedded queries, fragments and backslashes are rejected before a request is sent.

No CodeQL rules, threat models or workflow checks are disabled, excluded or downgraded.

## Evidence

`server/_core/serviceBoundaries.test.ts` runs real HTTP clients against two ephemeral loopback servers. Each of the five integrations succeeds at its configured endpoint, then rejects a real HTTP 307 with zero requests reaching the redirect destination. The transport fixture permits HTTP loopback only in its mocked origin resolver; separate tests execute the actual production validators and confirm they reject insecure or non-origin configuration.

The 24 tests include six Maps path-escape cases and eight production-origin validation cases. Replacing the three repaired request modules with their original versions makes 11 tests fail: all five redirect cases and all six path-escape cases. Restoring the fixes makes all 24 pass. Untrusted URL-shaped payloads remain payloads throughout the successful service requests.
