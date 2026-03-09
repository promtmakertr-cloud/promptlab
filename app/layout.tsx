import React from 'react';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>Prompt Lab</title>
            </head>
            <body>{children}</body>
        </html>
    );
}