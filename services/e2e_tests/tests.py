import os
from time import sleep
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

def login_user(email, password, driver):
    login_button = driver.find_element(By.XPATH, 'html/body/div[2]/div[1]/header/div/button')
    login_button.click()
    sleep(0.5)
    email_input = driver.find_element(By.XPATH, '/html/body/div[2]/main/div/form/div[1]/div/input')
    email_input.send_keys(email)
    sleep(0.5)
    password_input = driver.find_element(By.XPATH, '/html/body/div[2]/main/div/form/div[2]/div/input')
    password_input.send_keys(password)
    sleep(0.5)
    sign_in_button = driver.find_element(By.XPATH, '/html/body/div[2]/main/div/form/button')
    sign_in_button.click()


def add_meal(driver):
    add_meal_button = driver.find_element(By.XPATH, '/html/body/div[2]/div[1]/header/div/button[2]')
    add_meal_button.click()
    sleep(0.5)
    title_add_meal_input = driver.find_element(By.XPATH, '/html/body/div[2]/form/main/div/div[2]/div[1]/div/div/input')
    title_add_meal_input.send_keys('schabowy testowy')
    sleep(0.5)
    description_add_meal_input = driver.find_element(By.XPATH,
                                                     '/html/body/div[2]/form/main/div/div[2]/div[2]/div/div/textarea')
    description_add_meal_input.send_keys('pychota')
    sleep(0.5)
    pick_up_times_input = driver.find_element(By.XPATH,
                                              '/html/body/div[2]/form/main/div/div[2]/div[6]/div/div/textarea')
    portions_input = driver.find_element(By.XPATH, '/html/body/div[2]/form/main/div/div[2]/div[4]/div/div/input')
    portions_input.send_keys(Keys.BACKSPACE)
    portions_input.send_keys(5)
    pick_up_times_input.send_keys('wieczor')
    sleep(0.5)
    upload_image_element = driver.find_element(By.XPATH, '/html/body/div[2]/form/main/div/div[2]/div[7]/section/div')
    assert 'uplader-container' in upload_image_element.get_attribute('class')
    upload_image_element_input = driver.find_element(By.XPATH, '/html/body/div[2]/form/main/div/div[2]/div[7]/section/div/input')
    upload_image_element_input.send_keys(os.getcwd()+'/schabowy_testowy.jpg')
    sleep(2.5)

    next_add_meal_btn = driver.find_element(By.XPATH, '/html/body/div[2]/form/main/div/div[3]/button')
    next_add_meal_btn.click()
    sleep(1)
    map = driver.find_element(By.XPATH, '/html/body/div[2]/form/main/div/div[2]/div')
    assert 'map' in map.get_attribute('class')

    create_offer_button = driver.find_element(By.XPATH, '/html/body/div[2]/form/main/div/div[3]/button')
    create_offer_button.click()


def test_login_create_offer_edit_profile_log_out(web_url='http://localhost:3007/'):
    driver = webdriver.Chrome('./chromedriver')
    driver.maximize_window()
    driver.get(web_url)

    login_user('test@test.com', 'test', driver)
    sleep(3)

    add_meal(driver)
    sleep(1)
    after_add_offer_text = driver.find_element(By.XPATH, '/html/body/div[2]/form/main/div/h5')
    assert 'Thank you for sharing!' in after_add_offer_text.get_attribute('innerText')

    profile_page_navbar_btn = driver.find_element(By.XPATH, '/html/body/div[2]/div[1]/header/div/div[2]/button[3]')
    profile_page_navbar_btn.click()
    sleep(0.5)
    profile_btn = driver.find_element(By.XPATH, '/html/body/div[4]/div[3]/ul/li[1]')
    profile_btn.click()
    sleep(1)
    edit_profile_btn = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div[1]/div[1]/div[1]/div[2]/button')
    edit_profile_btn.click()
    sleep(0.5)
    phone_number_edit_profile_input = driver.find_element(By.XPATH, '/html/body/div[5]/div[3]/div/div[2]/div/div[2]/div/div/input')
    phone_number_edit_profile_input.send_keys(Keys.BACKSPACE)
    sleep(0.5)
    phone_number_edit_profile_input.send_keys('3')
    sleep(0.5)
    save_edit_profile = driver.find_element(By.XPATH, '/html/body/div[5]/div[3]/div/div[3]/button[1]')
    save_edit_profile.click()
    sleep(1)

    your_offers_btn = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div[2]/header/div/div/div/button[2]')
    your_offers_btn.click()
    sleep(2)

    profile_page_navbar_btn.click()
    sleep(1)
    logout_btn = driver.find_element(By.XPATH, '/html/body/div[4]/div[3]/ul/li[2]')
    logout_btn.click()
    sleep(2)
    driver.close()


def test_login_order_confirm_pickup(web_url='http://localhost:3007/'):
    driver = webdriver.Chrome('./chromedriver')
    driver.maximize_window()
    driver.get(web_url)

    login_user('Jan@Gargas.com', 'test', driver)
    sleep(3)
    make_order_first_offer = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[1]/div/div[2]/div/div/div[1]/div/div/div[3]/div/button[2]')
    make_order_first_offer.click()
    sleep(1)
    order_portions_input = driver.find_element(By.XPATH, '/html/body/div[5]/div[3]/div/div[2]/p/form/input')
    order_portions_input.send_keys(Keys.BACKSPACE)
    order_portions_input.send_keys(2)
    sleep(1.5)
    confirm_order_btn = driver.find_element(By.XPATH, '/html/body/div[5]/div[3]/div/div[2]/p/form/div/button[1]')
    confirm_order_btn.click()
    sleep(1.5)
    profile_page_navbar_btn = driver.find_element(By.XPATH, '/html/body/div[2]/div[1]/header/div/div[2]/button[3]')
    profile_page_navbar_btn.click()
    sleep(0.5)
    profile_btn = driver.find_element(By.XPATH, '/html/body/div[4]/div[3]/ul/li[1]')
    profile_btn.click()
    sleep(1)
    confirm_pickup_btn = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div[2]/div[1]/div/div/div/div[5]/div/div/button[1]')
    confirm_pickup_btn.click()
    sleep(2)
    rating_4_star = driver.find_element(By.XPATH, '/html/body/div[5]/div[3]/div/div[2]/span/span[4]')
    rating_4_star.click()
    sleep(1.5)
    confirm_pickup_rating_btn = driver.find_element(By.XPATH, '/html/body/div[5]/div[3]/div/div[3]/button[1]')
    confirm_pickup_rating_btn.click()
    sleep(2.5)
    driver.close()


# test_login_create_offer_edit_profile_log_out()
# test_login_order_confirm_pickup()