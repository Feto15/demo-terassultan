import qrcode
from PIL import Image
import sys

try:
    logo_path = "Yogya-03.png"
    url = "https://terassultan.pages.dev/"
    output_path = "Teras_Sultan_QR_Logo.png"

    # Open logo
    logo = Image.open(logo_path)

    # Resize logo
    basewidth = 130
    wpercent = (basewidth / float(logo.size[0]))
    hsize = int((float(logo.size[1]) * float(wpercent)))
    logo = logo.resize((basewidth, hsize), Image.Resampling.LANCZOS)
    logo = logo.convert("RGBA")

    # Create QR code with high error correction
    qr = qrcode.QRCode(
        version=5, 
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=12,
        border=3,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # Generate QR code image (using the dark emerald color from the CSS)
    img = qr.make_image(fill_color="#064e3b", back_color="#ffffff").convert('RGBA')

    # Calculate position
    pos = ((img.size[0] - logo.size[0]) // 2, (img.size[1] - logo.size[1]) // 2)

    # Paste logo directly with a white padding box
    padding = 15
    bg_box = Image.new('RGBA', (logo.size[0] + padding*2, logo.size[1] + padding*2), 'white')
    bg_pos = ((img.size[0] - bg_box.size[0]) // 2, (img.size[1] - bg_box.size[1]) // 2)

    img.paste(bg_box, bg_pos)
    img.paste(logo, pos, mask=logo)

    img.save(output_path)
    print("QR Code with logo generated successfully.")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
