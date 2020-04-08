POST

```sh
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"fooPost":"foz","bar":"baz"}' \
  http://localhost:8000/foo
```

PUT

```sh
curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"foo":"foz","bar":"baz"}' \
  http://localhost:8000/foo/c
```

DELETE

```sh
curl --header "Content-Type: application/json" \
  --request DELETE \
  http://localhost:8000/foo/a
```
