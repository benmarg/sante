import { api } from "~/utils/api";
import { use, useMemo } from "react";

export default function ContactList() {
  const { data } = api.contact.getAll.useQuery();

  const directory = useMemo(() => {
    const directory = data?.reduce((acc, person) => {
      const letter = person.name[0].toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(person);
      return acc;
    }, {} as Record<string, typeof data>);
    return directory;
  }, [data]);
  return (
    <>
      {directory && (
        <nav className="h-full overflow-y-auto" aria-label="Directory">
          {Object.keys(directory)
            .sort()
            .map((letter) => (
              <div key={letter} className="relative">
                <div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
                  <h3>{letter}</h3>
                </div>
                <ul role="list" className="divide-y divide-gray-100">
                  {directory[letter]?.map((person) => (
                    <li key={person.email} className="flex gap-x-4 px-3 py-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-400 font-bold">
                        {person.name[0].toUpperCase()}
                        {person?.name.split(" ")[1]?.[0]?.toUpperCase() || ""}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {person.name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {person.email}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {person.phoneNumber}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </nav>
      )}
    </>
  );
}
