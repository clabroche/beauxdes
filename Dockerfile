FROM alpine:3.14 as builder
RUN apk --no-cache add gcc g++ make python3 nodejs npm
WORKDIR /beauxdes
COPY ./server .
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN npm i --production

FROM alpine:3.14
RUN apk --no-cache add nodejs udev ttf-freefont chromium harfbuzz nss musl
WORKDIR /beauxdes
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
COPY --from=builder /beauxdes .
CMD ["node", "bin/www"]
