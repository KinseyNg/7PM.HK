require 'test_helper'

class AuthControllerTest < ActionController::TestCase
  test "should get login" do
    get :login
    assert_response :success
  end

  test "should get logout" do
    get :logout
    assert_response :success
  end

  test "should get forgotpassword" do
    get :forgotpassword
    assert_response :success
  end

  test "should get userprofile" do
    get :userprofile
    assert_response :success
  end

end
