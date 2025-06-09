import ChoiceSection from '@/components/ChoiceSection'

export default function CocPage() {
  return (
    <main className="min-h-screen text-white p-4">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-xl font-bold">シナリオ選択画面</h1>
        <p>あなたの前に謎の扉が現れた。どうする？</p>
        <ChoiceSection />
      </div>
    </main>
  )
}
