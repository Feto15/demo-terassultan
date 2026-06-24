import qrcode
from PIL import Image
import os

url = "https://terasultan.pages.dev/"
logo_path = "Yogya-03.png"
output_path = "Teras_Sultan_QR_Logo.png"

# Setup QR code with high error correction (needed when adding a logo)
qr = qrcode.QRCode(
    version=5,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=12,
    border=2,
)
qr.add_data(url)
qr.make(fit=True)

# Generate QR image with Emerald Green color
img_qr = qr.make_image(fill_color="#064e3b", back_color="white").convert('RGBA')

# Try to open and paste the logo
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert('RGBA')
    
    # Calculate dimensions to make logo 25% of the QR code
    basewidth = int(img_qr.size[0] / 3.5)
    wpercent = (basewidth / float(logo.size[0]))
    hsize = int((float(logo.size[1]) * float(wpercent)))
    logo = logo.resize((basewidth, hsize), Image.Resampling.LANCZOS)

    # Add a white background padding behind the logo to cover the QR lines
    padding = 15
    white_bg_size = (logo.size[0] + padding * 2, logo.size[1] + padding * 2)
    white_bg = Image.new("RGBA", white_bg_size, "white")
    
    # Paste the logo onto the white background
    white_bg.paste(logo, (padding, padding), logo)

    # Position the white background block in the center of the QR
    pos = ((img_qr.size[0] - white_bg.size[0]) // 2, (img_qr.size[1] - white_bg.size[1]) // 2)
    
    # Paste it onto the QR code without mask (so the white is solid)
    img_qr.paste(white_bg, pos)

# Save the final image
img_qr.save(output_path)
print("Successfully generated QR Code pointing to " + url)
