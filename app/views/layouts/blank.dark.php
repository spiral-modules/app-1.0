<extends:layouts.html5/>

<block:resources>
    <yield:resources/>
    <asset:style href="resources/styles/spiral/blank.css"/>
</block:resources>

<block:body>
    <header class="header">
        <block:header>
            <div class="container">${page|Your Page Name}</div>
        </block:header>
    </header>
    <main>
        <div class="container">
            <yield:content/>
        </div>
    </main>
    <footer class="footer">
        <block:footer>
            <div class="container">
                <div class="copyright">${copyright}</div>
            </div>
        </block:footer>
    </footer>
</block:body>