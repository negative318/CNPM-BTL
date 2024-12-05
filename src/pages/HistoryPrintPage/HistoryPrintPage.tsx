import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../contexts/app.context";
import LoadingPage from "../../components/LoadingPage";
import { format } from "date-fns";

interface Log {
  id: number;
  logDescription: string;
  logStatus: "SUCCESSFUL" | "PENDING" | "FAILED";
  logDate?: string;
  logStartTime?: string;
  logEndTime?: string;
  pagePerSheet: number;
  numberOfCopy: number;
  document?: {
    url: string;
  };
}

export default function HistoryPrintPage() {
  const { profile } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const fetchAllLogs = async () => {
      let allLogs: Log[] = [];
      let pageNumber = 0;
      const pageSize = 10;

      try {
        while (true) {
          const response = await axios.get<{ content: Log[] }>(
            `http://localhost:8080/api/v1/printing/logs?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            {
              headers: {
                Authorization: `Bearer ${profile?.jwtToken}`,
              },
            }
          );
          console.log(response);
          const data = response.data.content;
          if (data.length === 0) {
            break;
          }

          allLogs = [...allLogs, ...data];
          pageNumber += 1;
        }

        setLogs(allLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.jwtToken) {
      fetchAllLogs();
    }
  }, [profile?.jwtToken]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = [...logs].reverse().slice(startIndex, endIndex);

  const totalPages = Math.ceil(logs.length / itemsPerPage);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="container px-4 py-10 mx-auto">
        {loading ? (
          <LoadingPage />
        ) : (
          <h1 className="mb-8 text-4xl font-bold tracking-wide text-center text-blue-600 uppercase">
            Lịch Sử In
          </h1>
        )}
        <div className="w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
          {loading ? (
            <LoadingPage />
          ) : (
            <h2 className="py-4 text-2xl font-semibold text-center text-white bg-gradient-to-r from-blue-400 to-blue-600">
              Lịch sử in
            </h2>
          )}
          {loading ? (
            <LoadingPage />
          ) : (
            <>
              <div className="lich-su-in">
                <div className="table-container"></div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-blue-800 bg-blue-200">
                      <th className="px-8 py-4 border border-blue-300">
                        Tên file
                      </th>
                      <th className="px-8 py-4 border border-blue-300">
                        Trạng thái
                      </th>
                      <th className="px-8 py-4 border border-blue-300">
                        Ngày dự kiến lấy
                      </th>
                      <th className="px-8 py-4 border border-blue-300">
                        Thời gian bắt đầu
                      </th>
                      <th className="px-8 py-4 border border-blue-300">
                        Thời gian kết thúc
                      </th>
                      <th className="px-8 py-4 border border-blue-300">
                        Số trang mỗi tờ
                      </th>
                      <th className="px-8 py-4 border border-blue-300">
                        Số bản sao
                      </th>
                      <th className="px-8 py-4 border border-blue-300">
                        Tài liệu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLogs.map((log, index) => (
                      <tr
                        key={log.id}
                        className={`text-center ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}
                      >
                        <td className="px-8 py-4 border border-gray-300">
                          {log.logDescription}
                        </td>
                        <td className="px-8 py-4 font-semibold border border-gray-300">
                          {log.logStatus === "SUCCESSFUL" ? (
                            <span className="text-green-600">Thành công</span>
                          ) : log.logStatus === "PENDING" ? (
                            <span className="text-yellow-600">Đang chờ in</span>
                          ) : (
                            <span className="text-red-600">Thất bại</span>
                          )}
                        </td>
                        <td className="px-8 py-4 border border-gray-300">
                          {log.logDate
                            ? format(
                                new Date(log.logDate),
                                "dd/MM/yyyy HH:mm:ss"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-8 py-4 border border-gray-300">
                          {log.logStartTime
                            ? format(
                                new Date(log.logStartTime),
                                "dd/MM/yyyy HH:mm:ss"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-8 py-4 border border-gray-300">
                          {log.logEndTime
                            ? format(
                                new Date(log.logEndTime),
                                "dd/MM/yyyy HH:mm:ss"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-8 py-4 border border-gray-300">
                          {log.pagePerSheet}
                        </td>
                        <td className="px-8 py-4 border border-gray-300">
                          {log.numberOfCopy}
                        </td>
                        <td className="px-8 py-4 border border-gray-300">
                          <a
                            href={`http://localhost:8080${log.document?.url.replace(
                              "/public",
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            Tải tài liệu
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center mt-4">
                <button
                  className="px-4 py-2 mx-1 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Trang trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`px-4 py-2 mx-1 rounded ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  className="px-4 py-2 mx-1 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-300"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Trang sau
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
