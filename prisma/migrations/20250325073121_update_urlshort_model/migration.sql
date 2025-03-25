-- DropForeignKey
ALTER TABLE "ClickTracker" DROP CONSTRAINT "ClickTracker_urlId_fkey";

-- DropForeignKey
ALTER TABLE "UrlShort" DROP CONSTRAINT "UrlShort_userId_fkey";

-- AddForeignKey
ALTER TABLE "UrlShort" ADD CONSTRAINT "UrlShort_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickTracker" ADD CONSTRAINT "ClickTracker_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "UrlShort"("id") ON DELETE CASCADE ON UPDATE CASCADE;
