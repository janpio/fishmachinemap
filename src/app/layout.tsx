import StyledComponentsRegistry from './lib/registry'
import './reset.css'
import './fontWeb.css'
import StyledTheme from './style/styledTheme'

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html suppressHydrationWarning lang="es">
            <body>
                <StyledComponentsRegistry>
                    <StyledTheme>{children}</StyledTheme>
                </StyledComponentsRegistry>
            </body>
        </html>
    )
}
