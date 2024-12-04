import React, { useState, useEffect, useContext } from 'react';
import ReactDatePicker from "react-datepicker";
import axios, { AxiosError } from 'axios';
import { Check } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { AppContext } from '../../contexts/app.context';
import mainPath from '../../constants/path';


interface PrinterData {
  id: number;
  buildingName: string;
  campusName: string;
  description: string;
  printerStatus: string;
  roomNumber: string;
}

interface PrintSettings {
  copies: number
  paperSize: string
  sides: "1" | "2"
  scaling: number
  pages: string
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
  const {profile} = useContext(AppContext);
  const [step, setStep] = useState(1)
  const [campuses] = useState([
    { label: "Cơ sở Lý Thường Kiệt", value: "LTK" },
    { label: "Cơ sở Dĩ An Bình Dương", value: "DA" },
  ]);
  const [selectedCampus, setSelectedCampus] = useState("");

  const [printData, setPrintData] = useState<PrinterData[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [referenceCode, setReferenceCode] = useState("")
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    copies: 1,
    paperSize: "A4",
    sides: "1",
    scaling: 100,
    pages: "all",
  })
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
        
          setPrintRequestData({
            ...printRequestData,
            document: {filetype:"A4", start: 1, end: 10 }, // Cập nhật dữ liệu request
          });
  
          // Cập nhật mặc định `pages` thành "all"
          setPrintSettings({
            ...printSettings,
            pages: `1-10`,
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
    setUploadedFiles(uploadedFiles.filter((file) => file.name !== fileName))
  }

  const goToNextStep = () => {
    if (step < 4) {
      setStepAndValidate(step + 1)
    }
  }

  const setStepAndValidate = (newStep: number) => {
    if (newStep < step) {
      setStep(newStep)
    } else if (newStep > step) {
      if (step === 1 && selectedPrinter) {
        setStep(newStep)
      } else if (step === 2 && uploadedFiles.length > 0) {
        setStep(newStep)
      } else if (step === 3 && printSettings && printSettings.copies > 0) {
        setStep(newStep);
      }
    }
    console.log(step, printRequestData)
  }

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
        .get(`http://localhost:8080/api/v1/printers/status?location=${selectedCampus}&pageNumber=0&pageSize=10`, {
          headers: {
            Authorization: `Bearer ${profile?.jwtToken}`,
          },
        })
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
                  <div key={campus.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={campus.value} id={`campus-${campus.value}`} />
                    <Label htmlFor={`campus-${campus.value}`} className="cursor-pointer">
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
                  .filter((printer) => printer.buildingName === selectedBuilding)
                  .map((printer) => {
                    const isSelected = selectedPrinter === printer.id.toString();
                    const isDisabled = printer.printerStatus === "BROKEN";
                    
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
                          disabled={isDisabled}
                        >
                          <div className={`font-semibold ${isSelected ? "text-blue-600" : ""}`}>
                            {printer.description}
                          </div>
                          <div
                            className={`text-sm ${
                              printer.printerStatus === "ON" ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {printer.printerStatus === "ON" ? "Khả dụng" : "Bảo trì"}
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
      )
  

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
      
            <div className="space-y-4">
              <Label htmlFor="paper-size">Cỡ giấy</Label>
              <Select
                value={printSettings.paperSize}
                onValueChange={(value) =>
                  setPrintSettings({ ...printSettings, paperSize: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cỡ giấy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="A3">A3</SelectItem>
                </SelectContent>
              </Select>
            </div>
      
            <div className="space-y-4">
        <Label htmlFor="pagePerSheet">Số trang mỗi mặt</Label>
        <Select
          value={printRequestData.pagePerSheet.toString()}
          onValueChange={(value) =>
            setPrintRequestData({
              ...printRequestData,
              pagePerSheet: parseInt(value),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn số trang mỗi mặt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 trang</SelectItem>
            <SelectItem value="2">2 trang</SelectItem>
            <SelectItem value="4">4 trang</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <Label htmlFor="pages">Trang cần in</Label>
        <Input
          id="pages"
          value={printSettings.pages}
          onChange={(e) =>
            setPrintSettings({ ...printSettings, pages: e.target.value })
          }
          placeholder={`Ví dụ: 1-5, 8, 11-13`}
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
                    <strong>Số mặt giấy:</strong> {printSettings.sides === "1" ? "1 mặt" : "2 mặt"}
                  </p>
                  <p>
                    <strong>Trang cần in:</strong> {printSettings.pages || "Toàn bộ"}
                  </p>
                </div>
              </div>
            </div>
          );

      default:
        return null
    }
  }

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !selectedPrinter
      case 2:
        return uploadedFiles.length === 0
      case 3:
        // return printSettings.copies > 0
      default:
        return false
    }
  }

  

  const handlePrintSubmit = async () => {
    // Tạo mã tham chiếu mới
    const newReferenceCode = Math.floor(Math.random() * 100000000000).toString().padStart(11, '0');
    setReferenceCode(newReferenceCode);
  
    const configuration = {
      logDate: logDate ? logDate.toISOString() : '',
      pagePerSheet: printRequestData.pagePerSheet,
      numberOfCopy: printRequestData.numberOfCopy,
      document: {
        pageType: printRequestData.document.filetype || 'A4',
        start: printRequestData.document.start || 1,
        end: printRequestData.document.end || 1,
      },
      printerId: printRequestData.printerID,
    };
  
    const formData = new FormData();

    formData.append('file', uploadedFiles[0]);
    
    const blobConfig = new Blob([JSON.stringify(configuration)], { type: 'application/json' });
    formData.append('configuration', blobConfig);
    try {
      const response = await axios.post('http://localhost:8080/api/v1/printing', formData, {
        headers: {
          "Content-type": "multipart/form-data",
          "Authorization": `Bearer ${printRequestData.jwtToken}`,
        },
      });
  
      if (response.status === 200) {
        console.log('Print request successful:', response.data);
        setShowSuccessDialog(true);
        window.location.href = mainPath.historyBuyPage;
      } else {
        alert('Đã xảy ra lỗi không xác định.');
      }
    } catch (error) {
      console.error('Error submitting print request:', error);
    
      if (error instanceof AxiosError && error.response) {
        const { status, data } = error.response;
    
        if (status === 400 && data.message === 'Không đủ giấy') {
          alert('Không đủ giấy! Vui lòng mua thêm.');
          window.location.href = mainPath.buypage;
        } else {
          console.error('Response data:', data);
          alert('Đã xảy ra lỗi khi gửi yêu cầu in.');
        }
      } else if (error instanceof Error) {
        alert(`Lỗi: ${error.message}`);
      } else {
        alert('Không thể kết nối với máy chủ.');
      }
    }
    
  };
  
  
  

  return (
    <div className="container max-w-3xl p-4 mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">IN ẤN</CardTitle>
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
              Bước {step}: {step === 1 ? "Chọn máy in" : step === 2 ? "Chọn tệp tải lên" : step === 3 ? "Chỉnh thông số in" : "Xem trước in"}
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

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-blue-600">
              <Check className="w-6 h-6 text-green-500" />
              Yêu cầu in ấn thành công
            </DialogTitle>
            <DialogDescription className="pt-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg shadow-sm bg-blue-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-medium text-gray-700">Số trang:</div>
                    <div className="text-sm font-semibold text-right text-gray-900">
                      {uploadedFiles.reduce((acc, file) => acc + 1, 0) * printSettings.copies} trang
                    </div>
                    <div className="text-sm font-medium text-gray-700">Mã tham chiếu:</div>
                    <div className="font-mono text-sm text-right text-blue-600">
                      {referenceCode}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Vui lòng lưu lại mã tham chiếu để theo dõi trạng thái in ấn của bạn.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>


    </div>
  )
}