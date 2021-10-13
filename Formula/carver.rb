class Carver < Formula
  desc "A suite of utilities for reverse engineering software"
  homepage "https://github.com/Reboot-Codes/carver-utils#carver-utils"

  # AAAAHRG, Building is annoying
  depends_on "node"
  depends_on "yarn"

  def install 
    system "yarn install"
    system "yarn link"
  end
end