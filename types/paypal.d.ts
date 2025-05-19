interface Window {
  paypal?: {
    Buttons: (config: any) => {
      render: (containerId: string) => void
    }
    HostedButtons?: (config: any) => {
      render: (containerId: string) => void
    }
  }
}
