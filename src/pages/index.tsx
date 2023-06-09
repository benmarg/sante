import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContactSchema as schema,
  type CreateContactInput,
} from "~/validations/contacts";

import ContactList from "~/componenets/ContactList";

const Home: NextPage = () => {
  function Form() {
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<CreateContactInput>({
      resolver: zodResolver(schema),
    });

    const apiContext = api.useContext();
    const { mutate, status, error } = api.contact.create.useMutation({
      onSuccess() {
        return apiContext.contact.getAll.invalidate();
      },
    });

    return (
      <form
        onSubmit={handleSubmit((data) =>
          mutate(data, {
            onSuccess() {
              reset();
            },
          })
        )}
        className="flex flex-col gap-6"
      >
        <input
          {...register("name")}
          placeholder="Name"
          className="flex rounded-md p-1 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
        />
        <input
          {...register("email")}
          placeholder="Email Address"
          className="flex rounded-md p-1 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
        />
        <input
          {...register("phoneNumber")}
          placeholder="Phone Number"
          className="flex rounded-md p-1 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
        />
        {errors.name && (
          <span className="text-red-600">{errors.name.message}</span>
        )}
        {errors.email && (
          <span className="text-red-600">{errors.email.message}</span>
        )}
        {errors.phoneNumber && (
          <span className="text-red-600">
            Please Enter A Valid Phone Number
          </span>
        )}
        {error && <span className="text-red-600">{error.message}</span>}
        {!errors.name && !errors.email && !errors.phoneNumber && <span> </span>}
        <input
          className="w-72 rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          type="submit"
        />
      </form>
    );
  }

  return (
    <>
      <Head>
        <title>Sante Contact List</title>
        <meta
          name="description"
          content="A contact list to keep track of your favorite contacts!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto">
        <div className="fixed h-5 w-full bg-slate-300"></div>
        <div className="fixed h-full w-5 bg-slate-300"></div>
        <div className="fixed bottom-0 h-5 w-full bg-slate-300"></div>
        <div className="fixed right-0 h-full w-5 bg-slate-300"></div>
        <div className="flex min-h-screen items-center justify-evenly">
          <Form />
          <div className="h-96 w-96">
            <ContactList />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
