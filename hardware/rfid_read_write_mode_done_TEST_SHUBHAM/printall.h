bool SerialEnable;
void fprintln(String s)
{
	if(SerialEnable) Serial.println(s);
	
}
void fprintln(int s)
{
	if(SerialEnable) Serial.println(s);
}

void fprint(String s)
{
	if(SerialEnable)Serial.print(s);
}
void fprint(int s)
{
	if(SerialEnable) Serial.print(s);
}
