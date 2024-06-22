import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "db";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { DB } = context.cloudflare.env;

  const result = await db(DB).selectFrom("user").selectAll().execute();
  return json(result);
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { DB } = context.cloudflare.env;
  console.log("dasd");
  const body = await request.formData();

  await db(DB)
    .insertInto("user")
    .values({
      id: Number(Math.floor(Math.random() * 1000) + 1),
      first_name: String(body.get("firstName")),
      last_name: String(body.get("lastName")),
    })
    .executeTakeFirst();

  return null;
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  let optimisticAddUser = {
    firstName: "",
    lastName: "",
  };

  if (fetcher.formData?.has("firstName") && fetcher.formData?.has("lastName")) {
    optimisticAddUser = {
      firstName: String(fetcher.formData?.get("firstName")),
      lastName: String(fetcher.formData?.get("lastName")),
    };
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix Demo app with D1 Database</h1>
      <fetcher.Form method="post">
        <input placeholder="First Name" name="firstName" type="text" />
        <input placeholder="Last Name" name="lastName" type="text" />
        <button type="submit">Create</button>
      </fetcher.Form>

      <div>
        <h3>Users List</h3>
        <ul>
          {!!optimisticAddUser.firstName && !!optimisticAddUser.lastName && (
            <li>
              {optimisticAddUser.firstName}, {optimisticAddUser.lastName}
            </li>
          )}
          {data.map((user) => (
            <li key={user.id}>
              {user.first_name}, {user.last_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
