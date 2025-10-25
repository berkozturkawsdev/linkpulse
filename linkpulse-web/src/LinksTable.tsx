import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

export default function LinksTable({ results }) {
  return (
    <div className="overflow-x-auto w-full max-w-5xl mx-auto mt-10">
      <table className="min-w-full rounded-xl overflow-hidden">
        <thead className="bg-[#1DB954] text-white uppercase text-sm tracking-wide shadow-sm">
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
        <tbody className="divide-y divide-gray-800">
          {results.map((link, idx) => (
            <tr
              key={idx}
              className={`transition duration-150 ${
                link.broken
                  ? "bg-red-900 hover:bg-red-800"
                  : "bg-[#191414] hover:bg-[#222222]"
              }`}
            >
              <td className="py-3 px-6 break-all text-[#1DB954] hover:underline">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </td>
              <td className="py-3 px-6 text-center text-[#B3B3B3] font-medium">
                {link.status}
              </td>
              <td className="py-3 px-6 text-center">
                {link.broken ? (
                  <div className="flex items-center justify-center space-x-1 text-red-500">
                    <XCircleIcon className="w-5 h-5" />
                    <span>Yes</span>
                  </div>
                ) : link.status >= 300 && link.status < 400 ? (
                  <div className="flex items-center justify-center space-x-1 text-yellow-400">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span>Redirect</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-1 text-[#1DB954]">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>No</span>
                  </div>
                )}
              </td>
              <td className="py-3 px-6 text-[#B3B3B3] text-sm">
                {link.message || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
