import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

export default function LinksTable({ results }) {
  return (
    <div className="overflow-x-auto w-full max-w-5xl mx-auto mt-10">
      <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead className="bg-indigo-500 text-white uppercase text-sm tracking-wide shadow-sm">
          <tr>
            <th className="py-3 px-6 text-left text-sm font-medium">URL</th>
            <th className="py-3 px-6 text-center text-sm font-medium">
              Status
            </th>
            <th className="py-3 px-6 text-center text-sm font-medium">
              Broken
            </th>
            <th className="py-3 px-6 text-left text-sm font-medium">Message</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {results.map((link, idx) => (
            <tr
              key={idx}
              className={`transition duration-150 ${
                link.broken ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"
              }`}
            >
              <td className="py-3 px-6 break-all text-indigo-600 hover:underline">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </td>
              <td className="py-3 px-6 text-center text-gray-700 font-medium">
                {link.status}
              </td>
              <td className="py-3 px-6 text-center">
                {link.broken ? (
                  <div className="flex items-center justify-center space-x-1 text-red-600">
                    <XCircleIcon className="w-5 h-5" />
                    <span>Yes</span>
                  </div>
                ) : link.status >= 300 && link.status < 400 ? (
                  <div className="flex items-center justify-center space-x-1 text-yellow-500">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span>Redirect</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-1 text-green-600">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>No</span>
                  </div>
                )}
              </td>
              <td className="py-3 px-6 text-gray-500 text-sm">
                {link.message || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
