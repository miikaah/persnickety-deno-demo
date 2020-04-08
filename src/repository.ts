// @ts-ignore
import {
  writeJson,
  readFileStr,
  ensureFile,
} from "https://deno.land/std/fs/mod.ts";

const FILE = "./foos.json";

export const foos = new Map<string, string>([
  ["a", "fooA"],
  ["b", "fooB"],
]);

type Foo = {
  id: string;
  foo: string;
};

const writeFoosToFs = async (foos: Foo[]): Promise<void> => {
  return writeJson(FILE, foos, { spaces: 2 });
};

const readFoosFromFs = async (): Promise<Foo[]> => {
  let fsFoos: Foo[] = [];
  try {
    fsFoos = JSON.parse(await readFileStr(FILE, { encoding: "utf-8" }));
  } catch (e) {
    ensureFile(FILE);
  }
  return fsFoos;
};

export const addFoo = async (foo: Foo): Promise<void> => {
  const fsFoos = await readFoosFromFs();
  return writeFoosToFs([...fsFoos, foo]);
};

export const getAllFoos = async (): Promise<Foo[]> => {
  return readFoosFromFs();
};

export const getFoo = async (id: string): Promise<Foo | undefined> => {
  return (await readFoosFromFs()).find(
    (foo: Foo | undefined) => foo?.id === id
  );
};

export const removeFoo = async (id: string): Promise<void> => {
  const fsFoos = await readFoosFromFs();
  return writeFoosToFs(fsFoos.filter((foo) => foo.id !== id));
};
