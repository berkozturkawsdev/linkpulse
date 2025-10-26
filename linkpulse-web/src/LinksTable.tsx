import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

export default function LinksTable({ results }) {
  return (
    <div className="overflow-x-auto w-full max-w-5xl mx-auto mt-10">
      <table className="min-w-full rounded-xl overflow-hidden">
        <thead className="table-header text-white uppercase text-sm tracking-wide shadow-sm">
          <tr>
            <th className="py-3 px-6 text-left text-sm ">URL</th>
            <th className="py-3 px-6 text-center text-sm ">Status</th>
            <th className="py-3 px-6 text-center text-sm ">Broken</th>
            <th className="py-3 px-6 text-left text-sm ">Message</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {results.map((link, idx) => (
            <tr
              key={idx}
              className={`transition duration-150 ${
                link.broken ? "table-row-error" : "table-row-success"
              }`}
            >
              <td className="py-3 text-sm px-6 break-all  hover:underline">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </td>
              <td className="py-3 text-sm px-6 text-center  ">{link.status}</td>
              <td className="py-3 text-sm px-6 text-center">
                {link.broken ? (
                  <div className="flex items-center justify-center space-x-1 ">
                    <XCircleIcon className="w-5 h-5" />
                    <span>Yes</span>
                  </div>
                ) : link.status >= 300 && link.status < 400 ? (
                  <div className=" text-sm flex items-center justify-center space-x-1 ">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span>Redirect</span>
                  </div>
                ) : (
                  <div className=" text-sm flex items-center justify-center space-x-1 ">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>No</span>
                  </div>
                )}
              </td>
              <td className="py-3 px-6  text-sm ">{link.message || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
