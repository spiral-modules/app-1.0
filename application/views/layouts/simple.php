<use namespace="spiral"/>
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <style>
        html {
            height: 90%;
        }

        body {
            height: 100%;
            min-height: 100%;
            margin: 0;
            color: #595a59;
            font-family: "Helvetica", sans-serif;
            font-weight: lighter;
            font-size: 14px;
        }

        .wrapper {
            position: relative;
            top: 10%;
            transform: translate(50%,-50%);
            -webkit-transform: translate(50%,50%);
            text-align: center;
            width: 50%;
        }

        a {
            color: #5fa4ea;
        }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="placeholder">
       <block:content/>
    </div>
</div>
</body>
</html>
