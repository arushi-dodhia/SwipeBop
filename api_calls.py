import requests

baseURL = 'https://api.shopbop.com'
baseIMGURL = 'https://m.media-amazon.com/images/G/01/Shopbop/p'

headers = {
    'accept': 'application/json',
    'Client-Id': 'Shopbop-UW-Team2-2024',
    'Client-Version': '1.0.0'
}

def search_products(q='shirts', limit=10, lang='en-US', dept='WOMENS', allowOutOfStockItems="false"):
    url = baseURL + '/public/search'
    params = {
        "q": q,
        "limit": limit,
        "dept": dept,
        "lang": lang,
        "allowOutOfStockItems": allowOutOfStockItems
    }

    try:
        resp = requests.get(url, headers=headers, params=params)

        if resp.status_code == 200:
            products = resp.json()
            return products
        else:
            print('Error:', resp.status_code)
            return None
        
    except requests.exceptions.RequestException as e:
        print('Error:', e)
        return None

def get_categories(lang='en-US', dept='WOMENS'):
    url = baseURL + '/public/folders'
    params = {
        "dept": dept,
        "lang": lang
    }

    try:
        resp = requests.get(url, headers=headers, params=params)

        if resp.status_code == 200:
            categories = resp.json()
            return categories
        else:
            print('Error:', resp.status_code)
            return None
        
    except requests.exceptions.RequestException as e:
        print('Error:', e)
        return None

def browse_by_category(q='shirts', id='13198', limit=10, lang='en-US', dept='WOMENS', allowOutOfStockItems="false"):
    url = baseURL + '/public/categories/' + id + '/products'
    params = {
        "q": q,
        "limit": limit,
        "dept": dept,
        "lang": lang,
        "allowOutOfStockItems": allowOutOfStockItems
    }

    try:
        resp = requests.get(url, headers=headers, params=params)

        if resp.status_code == 200:
            products = resp.json()
            return products
        else:
            print('Error:', resp.status_code)
            return None
            
    except requests.exceptions.RequestException as e:
        print('Error:', e)
        return None

def get_outfits(productSin='1521306412', lang='en-US'):
    url = baseURL + '/public/products/' + productSin + '/outfits'
    params = {
        "lang": lang
    }

    try:
        resp = requests.get(url, headers=headers, params=params)

        if resp.status_code == 200:
            outfits = resp.json()
            return outfits
        else:
            print('Error:', resp.status_code)
            return None
            
    except requests.exceptions.RequestException as e:
        print('Error:', e)
        return None
    
def get_images(colorIdx = 0):
    products = search_products()
    imagesURL = {}

    # Suffix of only first product
    # suffix = products['products'][0]['product']['colors'][0]['images'][0]['src']
    
    # Suffix of all products
    for product in products['products']:
        imagesURL[product['product']['productSin']] = baseIMGURL + product['product']['colors'][colorIdx]['images'][0]['src']

    return imagesURL

def main():
    # Search Products by Query
    # products = search_products()
    # print(products['products'])
    
    # Get List of Categories
    # categories = get_categories()
    # print(categories['categories'])

    # Get Products by Categories
    # products = browse_by_category()
    # print(products['products'])

    # Get Outfits
    # outfits = get_outfits()
    # print(outfits['styleColorOutfits'][0]['outfits'][0])

    # Get Images
    # images = get_images()
    # print(images)
    return

if __name__ == '__main__':
    main()