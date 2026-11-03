Unicode true
Name "Pomodoro"
OutFile "C:\Users\90725\WorkBuddy AI\2026-10-31-19-32-55\pomodoro-widget\dist\PomodoroPortable.exe"
RequestExecutionLevel user
SilentInstall silent
AutoCloseWindow true
Icon "C:\Users\90725\WorkBuddy AI\2026-10-31-19-32-55\pomodoro-widget\icon.ico"

Section
  ; extract to a fixed user dir so it is NOT deleted when the launcher exits
  SetOutPath "$LOCALAPPDATA\PomodoroCard\app"
  File /r "C:\Users\90725\WorkBuddy AI\2026-10-31-19-32-55\pomodoro-widget\dist\win-unpacked\*.*"
  ; run via nsExec so the launcher does not own/kill the app process
  nsExec::Exec '"$LOCALAPPDATA\PomodoroCard\app\PomodoroCard.exe"'
SectionEnd
