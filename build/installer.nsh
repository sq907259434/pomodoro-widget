; 番茄钟只清理自己的桌面右键菜单键；TimerWidget 是倒计时卡片的，不能动
!macro customUnInstall
  DeleteRegKey HKCU "Software\Classes\DesktopBackground\Shell\PomodoroWidget"
!macroend
