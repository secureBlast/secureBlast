from Crypto.Cipher import AES
from cryptography.fernet import Fernet
import binascii, os
import codecs
import json

# pip3 install pycryptodome

# secretKey = os.urandom(32) # 256-bit random encryption key
# print("Encryption key:", binascii.hexlify(secretKey))


# Instance the Fernet class with the key
fernet = Fernet(b'1V11vt_erGI_11MxE9yuNLSFGH_aadC0gByy8d2wKds=')

def except_encryption(msg):
    encMessage = fernet.encrypt(msg.encode())
    encMessage = codecs.decode(encMessage, 'utf-8')
    return encMessage


def except_decryption(enc_msg):
    # decrypt the encrypted string
    enc_msg = codecs.encode(enc_msg, 'utf-8')
    decMessage = fernet.decrypt(enc_msg).decode()
    return decMessage


def get_encryption_key():
    my_key = "12dfdgfdgfdfg345g64euyrgeye5fy5n"
    my_key = codecs.encode(my_key, 'Windows-1252')
    return my_key


def encrypt_AES_GCM(msg, secretKey):
    try:
        msg_byt = codecs.encode(msg, 'Windows-1252')
        aesCipher = AES.new(secretKey, AES.MODE_GCM)
        ciphertext, authTag = aesCipher.encrypt_and_digest(msg_byt)
        a = codecs.decode(ciphertext, 'Windows-1252')
        b = codecs.decode(aesCipher.nonce,'Windows-1252')
        c = codecs.decode(authTag, 'Windows-1252')
        return (a, b, c)
    except:
        return except_encryption(msg)


def decrypt_AES_GCM(encryptedMsg, secretKey):
    if "gAAAAAB" in encryptedMsg:
        return except_decryption(encryptedMsg)
    else:
        ciphertext = encryptedMsg[0].encode('Windows-1252')
        nonce = encryptedMsg[1].encode('Windows-1252')
        authTag = encryptedMsg[2].encode('Windows-1252')
        aesCipher = AES.new(secretKey, AES.MODE_GCM, nonce)
        plaintext = aesCipher.decrypt_and_verify(ciphertext, authTag)
        return plaintext

def decrypt(a,b,c, secretKey):
    if "gAAAAAB" in a:
        return except_decryption(a)
    else:
        ciphertext = a.encode('Windows-1252')
        nonce = b.encode('Windows-1252')
        authTag = c.encode('Windows-1252')
        aesCipher = AES.new(secretKey, AES.MODE_GCM, nonce)
        plaintext = aesCipher.decrypt_and_verify(ciphertext, authTag)
        return plaintext


msg = 'Hi'
encryptedMsg = encrypt_AES_GCM(msg, get_encryption_key())
# print(type(encryptedMsg[0].decode('Windows-1252')))
# print("encryptedMsg", {
# 'ciphertext': binascii.hexlify(encryptedMsg[0]),
# 'aesIV': binascii.hexlify(encryptedMsg[1]),
# 'authTag': binascii.hexlify(encryptedMsg[2])
# })

decryptedMsg = decrypt_AES_GCM(encryptedMsg, get_encryption_key())
print("decryptedMsg", decryptedMsg)

# res = except_encryption("msg")
# print(res)
# dec = except_decryption(res)
# print(dec)

