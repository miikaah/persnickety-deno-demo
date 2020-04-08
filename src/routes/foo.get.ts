// @ts-ignore
import { foos, fooPosts } from '../repository.ts';
// @ts-ignore
import { addGet, Request } from '../router.util.ts';

export default function initFooGet(): void {
  addGet('/foo', function getFoo(req: Request): Promise<void> {
    return req.respond({ body: Array.from(foos.values()).join(', ') });
  })
  addGet('/foo-posts', function getFoo(req: Request): Promise<void> {
    return req.respond({ body: fooPosts.join(', ') });
  })
  addGet('/foo/:id', function getFooById(req: Request): Promise<void> {
    const foo = foos.get(req.pathParams.id)

    if (!foo) return req.respond({ status: 404, body: 'Not Found' });

    return req.respond({ status: 200, body: foo });
  })
}
