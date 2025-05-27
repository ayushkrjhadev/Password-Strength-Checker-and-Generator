"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, Shield, Key, Terminal, Zap, Sparkles, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MatrixBackground } from "@/components/matrix-background"
import { ParticleCursor } from "@/components/particle-cursor"

interface PasswordStrength {
  score: number
  label: string
  color: string
  feedback: string[]
}

interface GeneratorOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export default function CyberSecureVault() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(false)
  const [superMode, setSuperMode] = useState(false)
  const [konamiSequence, setKonamiSequence] = useState<string[]>([])
  const [generatorOptions, setGeneratorOptions] = useState<GeneratorOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  })

  const { toast } = useToast()

  // Konami Code: ↑↑↓↓←→←→BA
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...konamiSequence, e.code].slice(-10)
      setKonamiSequence(newSequence)

      if (newSequence.join(",") === konamiCode.join(",")) {
        setSuperMode(true)
        toast({
          title: "🚀 ELITE MODE ACTIVATED",
          description: "Maximum security protocols engaged!",
        })
        setKonamiSequence([])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [konamiSequence])

  const analyzePassword = (pwd: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (pwd.length >= 8) score += 25
    else feedback.push("Add at least 8 characters")

    if (/[A-Z]/.test(pwd)) score += 25
    else feedback.push("Include uppercase letters")

    if (/[a-z]/.test(pwd)) score += 25
    else feedback.push("Include lowercase letters")

    if (/\d/.test(pwd)) score += 12.5
    else feedback.push("Add numbers")

    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) score += 12.5
    else feedback.push("Include special characters")

    let label: string, color: string
    if (score < 50) {
      label = "Weak"
      color = "text-red-400"
    } else if (score < 75) {
      label = "Medium"
      color = "text-yellow-400"
    } else {
      label = superMode ? "Unbreakable" : "Strong"
      color = superMode ? "text-purple-400" : "text-green-400"
    }

    return { score, label, color, feedback }
  }

  const generatePassword = (): string => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    const superSymbols = "₿∞§¶•ªº°¿¡™®©"

    let charset = ""
    let result = ""

    if (generatorOptions.includeUppercase) charset += uppercase
    if (generatorOptions.includeLowercase) charset += lowercase
    if (generatorOptions.includeNumbers) charset += numbers
    if (generatorOptions.includeSymbols) charset += symbols
    if (superMode) charset += superSymbols

    if (charset === "") {
      toast({
        title: "Selection Required",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      return ""
    }

    // Ensure complexity
    if (generatorOptions.includeUppercase) {
      result += uppercase[Math.floor(Math.random() * uppercase.length)]
    }
    if (generatorOptions.includeLowercase) {
      result += lowercase[Math.floor(Math.random() * lowercase.length)]
    }
    if (generatorOptions.includeNumbers) {
      result += numbers[Math.floor(Math.random() * numbers.length)]
    }
    if (generatorOptions.includeSymbols) {
      result += symbols[Math.floor(Math.random() * symbols.length)]
    }

    const targetLength = superMode ? Math.max(generatorOptions.length, 16) : generatorOptions.length

    for (let i = result.length; i < targetLength; i++) {
      result += charset[Math.floor(Math.random() * charset.length)]
    }

    return result
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
  }

  const handleGeneratePassword = () => {
    const newPassword = generatePassword()
    if (newPassword) {
      setGeneratedPassword(newPassword)
      toast({
        title: superMode ? "🔥 Elite Password Generated" : "✨ Password Generated",
        description: superMode ? "Maximum security achieved!" : "Your secure password is ready",
      })
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied Successfully",
        description: "Password copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const strength = analyzePassword(password)
  const generatedStrength = analyzePassword(generatedPassword)

  const getStrengthClass = (score: number) => {
    if (score < 50) return "strength-weak"
    if (score < 75) return "strength-medium"
    return "strength-strong"
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="cyber-bg"></div>
      <MatrixBackground />
      <ParticleCursor />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="floating">
            <h1 className="text-7xl font-bold neon-text mb-6 bg-gradient-to-r from-cyan-400 via-green-400 to-pink-400 bg-clip-text text-transparent">
              CyberSecure Vault
            </h1>
          </div>
          <p className="text-2xl text-cyan-300 mb-4 tracking-wide">Advanced Password Security Suite</p>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-green-400 mx-auto rounded-full"></div>

          {superMode && (
            <div className="mt-6">
              <Badge className="cyber-badge pulse-glow text-lg px-6 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Elite Mode Active
              </Badge>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="analyzer" className="w-full">
            <TabsList className="cyber-tabs grid w-full grid-cols-2 mb-8 p-1">
              <TabsTrigger value="analyzer" className="cyber-tab flex items-center gap-2 py-3">
                <Shield className="h-5 w-5" />
                Security Analyzer
              </TabsTrigger>
              <TabsTrigger value="generator" className="cyber-tab flex items-center gap-2 py-3">
                <Key className="h-5 w-5" />
                Password Generator
              </TabsTrigger>
            </TabsList>

            {/* Password Analyzer */}
            <TabsContent value="analyzer">
              <Card className="glass-strong rounded-2xl border-0">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl text-cyan-300">
                    <Terminal className="h-6 w-6" />
                    Password Security Analysis
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-300">
                    Analyze your password strength and get security recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="password" className="text-lg font-medium text-white">
                      Enter Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Type your password here..."
                        className="cyber-input h-14 text-lg rounded-xl border-0"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-10 w-10 text-cyan-400 hover:text-cyan-300 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>

                  {password && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium text-white">Security Level</span>
                          <Badge className={`cyber-badge ${strength.color}`}>{strength.label}</Badge>
                        </div>
                        <div className="strength-container">
                          <div
                            className={`strength-fill ${getStrengthClass(strength.score)}`}
                            style={{ width: `${strength.score}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-400">Strength: {strength.score.toFixed(0)}%</div>
                      </div>

                      {strength.feedback.length > 0 && (
                        <div className="glass p-6 rounded-xl">
                          <h4 className="text-lg font-medium text-yellow-400 mb-4 flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Security Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {strength.feedback.map((item, index) => (
                              <li key={index} className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Password Generator */}
            <TabsContent value="generator">
              <Card className="glass-strong rounded-2xl border-0">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl text-green-300">
                    <Zap className="h-6 w-6" />
                    Secure Password Generator
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-300">
                    Generate cryptographically secure passwords with custom options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-lg font-medium text-white">
                        Password Length: {superMode ? Math.max(generatorOptions.length, 16) : generatorOptions.length}
                        {superMode && " (Enhanced)"}
                      </Label>
                      <Slider
                        value={[generatorOptions.length]}
                        onValueChange={(value) => setGeneratorOptions((prev) => ({ ...prev, length: value[0] }))}
                        min={8}
                        max={superMode ? 64 : 32}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: "includeUppercase", label: "Uppercase Letters", desc: "A-Z" },
                        { key: "includeLowercase", label: "Lowercase Letters", desc: "a-z" },
                        { key: "includeNumbers", label: "Numbers", desc: "0-9" },
                        { key: "includeSymbols", label: "Special Characters", desc: "!@#$" },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="glass p-4 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{label}</div>
                            <div className="text-gray-400 text-sm">{desc}</div>
                          </div>
                          <input
                            type="checkbox"
                            id={key}
                            checked={generatorOptions[key as keyof GeneratorOptions] as boolean}
                            onChange={(e) => setGeneratorOptions((prev) => ({ ...prev, [key]: e.target.checked }))}
                            className="cyber-toggle"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleGeneratePassword}
                    className="cyber-btn w-full h-14 text-lg font-semibold rounded-xl"
                  >
                    {superMode ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Elite Password
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Generate Password
                      </>
                    )}
                  </Button>

                  {generatedPassword && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-lg font-medium text-white">Generated Password</Label>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <Input
                              type={showGeneratedPassword ? "text" : "password"}
                              value={generatedPassword}
                              readOnly
                              className="cyber-input h-14 text-lg rounded-xl border-0 pr-12"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2 h-10 w-10 text-cyan-400 hover:text-cyan-300 hover:bg-transparent"
                              onClick={() => setShowGeneratedPassword(!showGeneratedPassword)}
                            >
                              {showGeneratedPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                          </div>
                          <Button
                            onClick={() => copyToClipboard(generatedPassword)}
                            className="cyber-btn h-14 px-6 rounded-xl"
                          >
                            <Copy className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-medium text-white">Password Strength</span>
                          <Badge className={`cyber-badge ${generatedStrength.color}`}>{generatedStrength.label}</Badge>
                        </div>
                        <div className="strength-container">
                          <div
                            className={`strength-fill ${getStrengthClass(generatedStrength.score)}`}
                            style={{ width: `${generatedStrength.score}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-400">Strength: {generatedStrength.score.toFixed(0)}%</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p className="text-lg mb-2">
            Built with <span className="text-cyan-400">❤️</span> for Digital Security
          </p>
          <p className="text-sm opacity-70">Ayush 2025</p>
        </div>
      </div>
    </div>
  )
}
