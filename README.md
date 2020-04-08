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
  --data '{"id":"a","foo":"foz"}' \
  http://localhost:8000/foo/a

curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"id":"b","bar":"baz"}' \
  http://localhost:8000/foo/b
```

DELETE

```sh
curl --header "Content-Type: application/json" \
  --request DELETE \
  http://localhost:8000/foo/a
```
