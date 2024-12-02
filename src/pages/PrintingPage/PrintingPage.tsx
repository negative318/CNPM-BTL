import { useState } from "react"
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

interface Campus {
  id: string
  name: string
}

interface Building {
  id: string
  name: string
  campusId: string
}

interface Printer {
  id: string
  name: string
  buildingId: string
  status: "available" | "maintenance"
}

interface PrintSettings {
  copies: number
  paperSize: string
  sides: "1" | "2"
  scaling: number
  pages: string
}

export default function PrintingPage() {
  const [step, setStep] = useState(1)
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null)
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)
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

  const campuses: Campus[] = [
    { id: "1", name: "Cơ sở Lý Thường Kiệt" },
    { id: "2", name: "Cơ sở Dĩ An Bình Dương" },
  ]

  const buildings: Building[] = [
    { id: "H4", name: "H4", campusId: "1" },
    { id: "H5", name: "H5", campusId: "1" },
    { id: "DA1", name: "DA1", campusId: "2" },
    { id: "DA2", name: "DA2", campusId: "2" },
  ]

  const printers: Printer[] = [
    { id: "1", name: "Máy in tầng 1 H4", buildingId: "H4", status: "available" },
    { id: "2", name: "Máy in tầng 2 H4", buildingId: "H4", status: "available" },
    { id: "3", name: "Máy in tầng 6 H4", buildingId: "H4", status: "maintenance" },
    { id: "4", name: "Máy in tầng 1 H5", buildingId: "H5", status: "available" },
    { id: "5", name: "Máy in tầng 1 DA1", buildingId: "DA1", status: "available" },
    { id: "6", name: "Máy in tầng 2 DA2", buildingId: "DA2", status: "available" },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles([...uploadedFiles, ...files])
    }
  }

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.name !== fileName))
  }

  const goToNextStep = () => {
    if (step < 3) {
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
      }
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Cơ sở mong muốn</Label>
              <RadioGroup 
                value={selectedCampus || ""} 
                onValueChange={(value) => {
                  setSelectedCampus(value)
                  setSelectedBuilding(null)
                  setSelectedPrinter(null)
                }}
                className="flex flex-col space-y-2"
              >
                {campuses.map((campus) => (
                  <div key={campus.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={campus.id} id={`campus-${campus.id}`} />
                    <Label htmlFor={`campus-${campus.id}`}>{campus.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {selectedCampus && (
              <div className="space-y-4">
                <Label htmlFor="building">Tòa nhà mong muốn</Label>
                <Select 
                  value={selectedBuilding || ""} 
                  onValueChange={(value) => {
                    setSelectedBuilding(value)
                    setSelectedPrinter(null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tòa nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings
                      .filter((building) => building.campusId === selectedCampus)
                      .map((building) => (
                        <SelectItem key={building.id} value={building.id}>
                          {building.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedBuilding && (
              <div className="space-y-4">
                <Label>Máy in mong muốn</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {printers
                    .filter((printer) => printer.buildingId === selectedBuilding)
                    .map((printer) => (
                      <Button
                        key={printer.id}
                        variant={selectedPrinter === printer.id ? "default" : "outline"}
                        className="flex-col items-start h-auto p-4 space-y-2"
                        onClick={() => setSelectedPrinter(printer.id)}
                        disabled={printer.status === "maintenance"}
                      >
                        <div className="font-semibold">{printer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {printer.status === "available" ? "Khả dụng" : "Bảo trì"}
                        </div>
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="file-upload">Chọn tệp tải lên</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
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
                  setPrintSettings({ ...printSettings, copies: parseInt(e.target.value) })
                }
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="paper-size">Cỡ giấy</Label>
              <Select
                value={printSettings.paperSize}
                onValueChange={(value) => setPrintSettings({ ...printSettings, paperSize: value })}
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

            <div className="space-y-4">
              <Label htmlFor="scaling">Độ thu phóng (%)</Label>
              <Input
                id="scaling"
                type="number"
                min="1"
                max="200"
                value={printSettings.scaling}
                onChange={(e) =>
                  setPrintSettings({ ...printSettings, scaling: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        )

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
              {[1, 2, 3].map((stepNumber) => (
                <Button
                  key={stepNumber}
                  variant={step === stepNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStepAndValidate(stepNumber)}
                >
                  Bước {stepNumber}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: 3 }, (_, i) => (
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
              Bước {step}: {step === 1 ? "Chọn máy in" : step === 2 ? "Chọn tệp tải lên" : "Chỉnh thông số in"}
            </h2>
          </div>
          {renderStepContent()}
          <div className="flex justify-end mt-6">
            {step < 3 ? (
              <Button onClick={goToNextStep} disabled={isNextDisabled()}>
                Tiếp tục
              </Button>
            ) : (
              <Button onClick={handlePrintSubmit}>Hoàn thành</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-6 h-6 text-green-500" />
              Yêu cầu in ấn thành công
            </DialogTitle>
            <DialogDescription className="pt-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm font-medium">Số trang:</div>
                    <div className="text-sm text-right">{uploadedFiles.reduce((acc, file) => acc + 1, 0) * printSettings.copies} trang</div>
                    <div className="text-sm font-medium">Mã tham chiếu:</div>
                    <div className="font-mono text-sm text-right">{referenceCode}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
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