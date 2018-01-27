require 'test_helper'

class ForumControllerTest < ActionController::TestCase
  test "should get showforum" do
    get :showforum
    assert_response :success
  end

  test "should get showtitle" do
    get :showtitle
    assert_response :success
  end

  test "should get showcm" do
    get :showcm
    assert_response :success
  end

  test "should get writecm" do
    get :writecm
    assert_response :success
  end

  test "should get writetitle" do
    get :writetitle
    assert_response :success
  end

  test "should get admin" do
    get :admin
    assert_response :success
  end

end
