import React, { useState, useEffect, useContext } from "react";
import ReactDatePicker from "react-datepicker";
import axios, { AxiosError } from "axios";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { AppContext } from "../../contexts/app.context";
import mainPath from "../../constants/path";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

interface PrinterData {
  id: number;
  buildingName: string;
  campusName: string;
  description: string;
  printerStatus: string;
  roomNumber: string;
}

interface PrintSettings {
  copies: number;
  paperSize: string;
  sides: "1" | "2";
  scaling: number;
  pages: string;
}

interface PrintRequestData {
  logDate: Date | null;
  pagePerSheet: number;
  numberOfCopy: number;
  document: {
    filetype: string;
    start: number;
    end: number;
  };
  printerID: string;
  jwtToken?: string;
}
export default function PrintingPage() {
  const { profile } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [campuses] = useState([
    { label: "Cơ sở Lý Thường Kiệt", value: "LTK" },
    { label: "Cơ sở Dĩ An Bình Dương", value: "DA" },
  ]);
  const [selectedCampus, setSelectedCampus] = useState("");
  GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

  const [printData, setPrintData] = useState<PrinterData[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");

  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    copies: 1,
    paperSize: "A4",
    sides: "1",
    scaling: 100,
    pages: "all",
  });
  const [printRequestData, setPrintRequestData] = useState<PrintRequestData>({
    logDate: new Date(),
    pagePerSheet: 1,
    numberOfCopy: 1,
    document: {
      filetype: "A4",
      start: 1,
      end: 2,
    },
    printerID: "0",
    jwtToken: profile?.jwtToken || "",
  });

  const [logDate, setLogDate] = useState<Date | null>(new Date());

  const handleDateChange = (date: Date | null) => {
    setLogDate(date);
    setPrintRequestData({
      ...printRequestData,
      logDate: date,
    });
  };

  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const file = files[0];
      if (file.type === "application/pdf") {
        setUploadedFiles([...uploadedFiles, ...files]);
        setPdfFile(URL.createObjectURL(file));
        const fileBlobUrl = URL.createObjectURL(file);
        let pdf;
        try {
          pdf = await getDocument(fileBlobUrl).promise;
          console.log("Chay được ồi>>>>", pdf.numPages);
        } catch (error) {
          console.error("Error loading PDF:", error);
        }

        setPrintRequestData({
          ...printRequestData,
          document: { filetype: "A4", start: 1, end: pdf?.numPages || 0 },
        });

        setPrintSettings({
          ...printSettings,
          pages: `1-${pdf?.numPages}`,
        });
      } else {
        alert("Vui lòng chọn tệp PDF");
      }
    }
  };

  const handleCopiesChange = (value: string) => {
    const copies = parseInt(value) || 1;
    setPrintSettings({ ...printSettings, copies });
    setPrintRequestData({ ...printRequestData, numberOfCopy: copies });
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.name !== fileName));
  };

  const goToNextStep = () => {
    if (step < 4) {
      setStepAndValidate(step + 1);
    }
  };

  const setStepAndValidate = (newStep: number) => {
    if (newStep < step) {
      setStep(newStep);
    } else if (newStep > step) {
      if (step === 1 && selectedPrinter) {
        setStep(newStep);
      } else if (step === 2 && uploadedFiles.length > 0) {
        setStep(newStep);
      } else if (step === 3 && printSettings && printSettings.copies > 0) {
        setStep(newStep);
      }
    }
    console.log(step, printRequestData);
  };

  useEffect(() => {
    console.log("printRequestData updated:", printRequestData);
  }, [printRequestData]);

  useEffect(() => {
    if (selectedCampus) {
      console.log("Stored jwtToken:", localStorage.getItem("jwtToken"));
      setPrintRequestData((prev) => ({
        ...prev,
        jwtToken: profile?.jwtToken,
      }));
      axios
        .get(
          `http://localhost:8080/api/v1/printers/status?location=${selectedCampus}&pageNumber=0&pageSize=10`,
          {
            headers: {
              Authorization: `Bearer ${profile?.jwtToken}`,
            },
          }
        )
        .then((response) => {
          const data = response.data.content;
          console.log(data);
          setPrintData(data);
        })
        .catch((error) => {
          console.error("Lỗi khi tải dữ liệu:", error);
        });
    } else {
      setPrintData([]);
    }
  }, [selectedCampus]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        const uniqueBuildings = Array.from(
          new Set(printData.map((printer) => printer.buildingName))
        );

        return (
          <div className="space-y-8">
            {/* Chọn cơ sở */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Chọn cơ sở</Label>
              <RadioGroup
                value={selectedCampus || ""}
                onValueChange={(value) => {
                  setSelectedCampus(value);
                }}
                className="flex flex-wrap gap-4"
              >
                {campuses.map((campus) => (
                  <div
                    key={campus.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={campus.value}
                      id={`campus-${campus.value}`}
                    />
                    <Label
                      htmlFor={`campus-${campus.value}`}
                      className="cursor-pointer"
                    >
                      {campus.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Chọn tòa nhà */}
            {selectedCampus && (
              <div className="space-y-4">
                <Label className="text-lg font-medium">Chọn tòa nhà</Label>
                <Select
                  value={selectedBuilding || ""}
                  onValueChange={(value) => {
                    setSelectedBuilding(value);
                    setSelectedPrinter(null);
                  }}
                >
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Chọn tòa nhà" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
                    {uniqueBuildings.map((building, index) => (
                      <SelectItem
                        key={index}
                        value={building}
                        className="px-4 py-2 transition-colors cursor-pointer hover:bg-blue-100 hover:text-blue-600"
                      >
                        {building} {/* Hiển thị tên tòa nhà */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Chọn máy in */}
            {selectedBuilding && (
              <div className="space-y-4">
                <Label className="text-lg font-medium">Chọn máy in</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {printData
                    .filter(
                      (printer) => printer.buildingName === selectedBuilding
                    )
                    .map((printer) => {
                      const isSelected =
                        selectedPrinter === printer.id.toString();
                      const isDisabled = printer.printerStatus === "OFF";

                      return (
                        <Button
                          key={printer.id}
                          variant={isSelected ? "default" : "outline"}
                          className={`flex-col items-start h-auto p-4 space-y-2 border-2 rounded-lg transition-colors ${
                            isDisabled
                              ? "opacity-50 cursor-not-allowed bg-gray-200 border-gray-300"
                              : isSelected
                              ? "bg-blue-100 border-blue-500 hover:bg-blue-200"
                              : "bg-white border-gray-300 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            if (!isDisabled) {
                              setSelectedPrinter(printer.id.toString());
                              setPrintRequestData({
                                ...printRequestData,
                                printerID: printer.id.toString(),
                              });
                            }
                          }}
                          disabled={printer.printerStatus !== "ON"}
                        >
                          <div
                            className={`font-semibold ${
                              isSelected ? "text-blue-600" : ""
                            }`}
                          >
                            {printer.description}
                          </div>
                          <div
                            className={`text-sm ${
                              printer.printerStatus === "ON"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {printer.printerStatus === "ON"
                              ? "Khả dụng"
                              : "Bảo trì"}
                          </div>
                        </Button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="file-upload">Chọn tệp tải lên</Label>
              <Input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveFile(file.name)}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="copies">Số bản in</Label>
              <Input
                id="copies"
                type="number"
                min="1"
                value={printSettings.copies}
                onChange={(e) => handleCopiesChange(e.target.value)}
                placeholder="Nhập số bản in"
              />
            </div>

            {/* Chọn cỡ giấy */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Chọn cỡ giấy</Label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {["A4", "A3"].map((size) => {
                  const isSelected = printSettings.paperSize === size;

                  return (
                    <Button
                      key={size}
                      variant={isSelected ? "default" : "outline"}
                      className={`flex-col items-center h-auto p-4 space-y-2 border-2 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-blue-100 border-blue-500 hover:bg-blue-200"
                          : "bg-white border-gray-300 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setPrintSettings({ ...printSettings, paperSize: size });
                        setPrintRequestData({
                          ...printRequestData,
                          document: {
                            ...printRequestData.document,
                            filetype: size,
                          },
                        });
                      }}
                    >
                      <div
                        className={`font-semibold ${
                          isSelected ? "text-blue-600" : ""
                        }`}
                      >
                        {size}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Chọn số trang mỗi mặt */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Số trang mỗi mặt</Label>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                {[1, 2, 4].map((pages) => {
                  const isSelected = printRequestData.pagePerSheet === pages;

                  return (
                    <Button
                      key={pages}
                      variant={isSelected ? "default" : "outline"}
                      className={`flex items-center justify-center h-auto p-4 space-y-2 border-2 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-blue-100 border-blue-500 hover:bg-blue-200"
                          : "bg-white border-gray-300 hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        setPrintRequestData({
                          ...printRequestData,
                          pagePerSheet: pages,
                        })
                      }
                    >
                      <div
                        className={`font-semibold ${
                          isSelected ? "text-blue-600" : ""
                        }`}
                      >
                        {pages} trang
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="pages">Trang cần in</Label>
              <Input
                id="pages"
                value={printSettings.pages}
                onChange={(e) => {
                  const value = e.target.value;
                  const [start, end] = value
                    .split("-")
                    .map((page) => parseInt(page.trim()));
                  setPrintSettings({ ...printSettings, pages: value });
                  setPrintRequestData({
                    ...printRequestData,
                    document: {
                      ...printRequestData.document,
                      start: start || 1,
                      end: end || 1000,
                    },
                  });
                }}
                placeholder="Ví dụ: 1-5, 8, 11-13"
              />
              <p className="text-sm text-gray-500">
                Mặc định: Tất cả các trang
              </p>
            </div>

            <div className="space-y-4">
              <Label htmlFor="log-date">Ngày giờ lấy bản in</Label>
              <ReactDatePicker
                id="log-date"
                selected={logDate}
                onChange={handleDateChange}
                dateFormat="Pp"
                className="w-full p-2 border rounded-md"
                placeholderText="Nhập hoặc chọn ngày giờ"
                isClearable
              />
              <p className="text-sm text-gray-500">
                Chọn hoặc nhập ngày và giờ mà bạn dự định đến lấy bản in.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {pdfFile ? (
                <div className="flex items-center justify-center">
                  <iframe
                    src={pdfFile}
                    title="PDF Preview"
                    style={{ width: "100%", height: "600px" }}
                    className="border rounded-md shadow-lg"
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Vui lòng chọn tệp PDF để xem trước.
                </div>
              )}
            </div>

            <div className="p-4 space-y-4 bg-gray-100 border rounded-lg">
              <div className="text-lg font-semibold">Thông tin in ấn:</div>
              <div className="text-sm">
                <p>
                  <strong>Số bản in:</strong> {printSettings.copies}
                </p>
                <p>
                  <strong>Cỡ giấy:</strong> {printSettings.paperSize}
                </p>
                <p>
                  <strong>Số mặt giấy:</strong>{" "}
                  {printSettings.sides === "1" ? "1 mặt" : "2 mặt"}
                </p>
                <p>
                  <strong>Trang cần in:</strong>{" "}
                  {printSettings.pages || "Toàn bộ"}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !selectedPrinter;
      case 2:
        return uploadedFiles.length === 0;
      case 3:
      // return printSettings.copies > 0
      default:
        return false;
    }
  };

  const handlePrintSubmit = async () => {
    const configuration = {
      logDate: logDate ? logDate.toISOString() : "",
      pagePerSheet: printRequestData.pagePerSheet,
      numberOfCopy: printRequestData.numberOfCopy,
      document: {
        pageType: printRequestData.document.filetype || "A4",
        start: printRequestData.document.start || 1,
        end: printRequestData.document.end || 1,
      },
      printerId: printRequestData.printerID,
    };

    const formData = new FormData();

    formData.append("file", uploadedFiles[0]);
    console.log("1111");
    const blobConfig = new Blob([JSON.stringify(configuration)], {
      type: "application/json",
    });
    formData.append("configuration", blobConfig);
    try {
      console.log("222222222");
      console.log(formData);
      const response = await axios.post(
        "http://localhost:8080/api/v1/printing",
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: `Bearer ${printRequestData.jwtToken}`,
          },
        }
      );
      console.log("33333333");
      if (response.status === 200) {
        console.log(response.status);
        console.log("Print request successful:", response.data);
        window.location.href = mainPath.historyprintpage;
      } else {
        alert("Đã xảy ra lỗi không xác định.");
      }
    } catch (error) {
      console.error("Error submitting print request:", error);

      if (error instanceof AxiosError && error.response) {
        const { status, data } = error.response;

        if (status === 400 && data.message === "Paper not enough") {
          alert("Không đủ giấy! Vui lòng mua thêm.");
          window.location.href = mainPath.buypage;
        } else {
          console.error("Response data:", data);
          alert("Đã xảy ra lỗi khi gửi yêu cầu in.");
        }
      } else if (error instanceof Error) {
        alert(`Lỗi: ${error.message}`);
      } else {
        alert("Không thể kết nối với máy chủ.");
      }
    }
  };

  return (
    <div className="container max-w-3xl p-4 mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">PRINT</CardTitle>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((stepNumber) => (
                <Button
                  key={stepNumber}
                  variant={step === stepNumber ? "default" : "outline"}
                  size="sm"
                  className={`relative ${
                    step === stepNumber
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  onClick={() => setStepAndValidate(stepNumber)}
                >
                  Bước {stepNumber}
                  {step === stepNumber && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  step >= i + 1 ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Bước {step}:{" "}
              {step === 1
                ? "Chọn máy in"
                : step === 2
                ? "Chọn tệp tải lên"
                : step === 3
                ? "Chỉnh thông số in"
                : "Xem trước in"}
            </h2>
          </div>
          {renderStepContent()}
          <div className="flex justify-end mt-6">
            {step < 4 ? (
              <Button onClick={goToNextStep} disabled={isNextDisabled()}>
                Tiếp tục
              </Button>
            ) : (
              <Button
                onClick={handlePrintSubmit}
                className="text-white bg-blue-600 hover:bg-blue-700"
              >
                Xác nhận in
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
