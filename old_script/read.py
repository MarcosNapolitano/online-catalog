#!/usr/bin/python3

# importing required classes
from pypdf import PdfReader
import re
import os
import subprocess
import platform

reader = PdfReader('test.pdf')

#text = reader.pages[0].extract_text()

text = ''

for i in reader.pages:
    text += i.extract_text()

header = re.compile(r"""
                    Padre\ Elizalde\ 543.\ Ciudadela                                                                                                  
                    \n
                    Lista\ de\ Precios\ 0\d\ -\ 0\d                                                                                                       
                    \n
                    Proviencia\ de\ \ Buenos\ Aires                                                                                                    
                    \n
                    E-mail:distribuidoradeloeste@hotmail.com                                                                                       
                    \n
                    Tel/Fax:4582-5446\ /WhatsApp\ 15\ 6679-5149                                                                        
                    \n
                    \d\d/\d\d/\d\d\d\d\ \d\d:\d\d
                    \n
                    """, re.VERBOSE)

companies = re.compile(r'^\d{5}\s[A-Z]+.*\n', re.MULTILINE)

asterisk = re.compile(r'[*]\n', re.MULTILINE)

description = re.compile(r'DESCRIPCION\nIMPORTE\n', re.MULTILINE)

prices = re.compile(r'\n[$].+$', re.MULTILINE)

double_lines = re.compile(r'\D\n[a-zA-Z0-9]', re.MULTILINE)

units = re.compile(r'\n.+[#].+[$].+$', re.MULTILINE)

edge1 = re.compile(r'SUDAMERICANA', re.MULTILINE)

edge2 = re.compile(r'PADRES.', re.MULTILINE)

edge3 = re.compile(r'\n\d\n', re.MULTILINE)

#exprs = [header, asterisk, description, edge2, prices, 
#         double_lines, companies, units]
exprs = [header, asterisk, description, companies, double_lines,
         edge1, edge2, edge3, prices, units]

def csvify(text):
    text = text.group()
    return text.replace("\n", "; ")

def remove_expresion(text, exprs):

    for i in range(len(exprs)):

        if i == 4:
            text = re.sub(exprs[i], lambda x: x.group()[0::2], text)
            continue

        if i == 7:
            text = re.sub(exprs[i], lambda x: x.group()[2], text)
            continue

        if i == 8:
            text = re.sub(exprs[i], csvify, text)
            continue

        text = re.sub(exprs[i], "", text)

    return text

def main():

    #print(remove_expresion(text,exprs))

    with open('text.txt', 'w') as f:
        f.write(remove_expresion(text, exprs))

    if platform.system() == 'Windows':
        os.startfile('text.txt') #type: ignore
    else:
        subprocess.run(['xdg-open', 'text.txt'])

main()
