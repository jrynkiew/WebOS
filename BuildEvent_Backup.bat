FOR %%A IN (%Date:/=%) DO SET Today=%%A

PATH %PATH%;"C:\Program Files\7-Zip";
7z a -t7z "E:\PROGRAMMING\WebOS\WebOS_backup_%TODAY%.7z" "C:\WebOS" -mx0 -xr!.vs -xr!.git