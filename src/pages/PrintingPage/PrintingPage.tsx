import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ChevronLeft, Check } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { AppContext } from '../../contexts/app.context';

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

export default function PrintingPage() {
  const {profile} = useContext(AppContext);
  const [step, setStep] = useState(1)
  const [campuses, setCampuses] = useState([
    { label: "Cơ sở Lý Thường Kiệt", value: "LTK" },
    { label: "Cơ sở Dĩ An Bình Dương", value: "BD" },
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

  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const file = files[0];
      if (file.type === "application/pdf") {
        setUploadedFiles([...uploadedFiles, ...files]);
        setPdfFile(URL.createObjectURL(file));
      } else {
        alert("Vui lòng chọn tệp PDF");
      }
    }
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
  }


  useEffect(() => {
    if (selectedCampus) {
      console.log("Stored jwtToken:", localStorage.getItem("jwtToken"));
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
                  setSelectedCampus(value); // Cập nhật campus
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
                          onClick={() => !isDisabled && setSelectedPrinter(printer.id.toString())}
                          disabled={isDisabled} // Thêm thuộc tính này
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
                onChange={(e) =>
                  setPrintSettings({ ...printSettings, copies: parseInt(e.target.value) || 1 })
                }
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
              <Label>Số mặt giấy</Label>
              <RadioGroup
                value={printSettings.sides}
                onValueChange={(value: "1" | "2") =>
                  setPrintSettings({ ...printSettings, sides: value })
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="sides-1" />
                  <Label htmlFor="sides-1">1 mặt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="sides-2" />
                  <Label htmlFor="sides-2">2 mặt</Label>
                </div>
              </RadioGroup>
            </div>
      
            <div className="space-y-4">
              <Label htmlFor="pages">Trang cần in</Label>
              <Input
                id="pages"
                value={printSettings.pages}
                onChange={(e) =>
                  setPrintSettings({ ...printSettings, pages: e.target.value })
                }
                placeholder="Ví dụ: 1-5, 8, 11-13"
              />
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

  const handlePrintSubmit = () => {
    // Generate a random reference code (in real app, this would come from the server)
    const newReferenceCode = Math.floor(Math.random() * 100000000000).toString().padStart(11, '0')
    setReferenceCode(newReferenceCode)
    setShowSuccessDialog(true)
  }

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
              Bước {step}: {step === 1 ? "Chọn máy in" : step === 2 ? "Chọn tệp tải lên" : step === 2 ? "Chỉnh thông số in" : "Xem trước in"}
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